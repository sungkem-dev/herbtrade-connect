import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { useAuth } from "./AuthContext";

export type Post = Tables<"posts"> & {
  author_name: string;
  author_avatar: string;
  author_is_verified: boolean;
  author_role: Enums<"app_role">;
  likes_count: number;
  comments_count: number;
  liked_by_user: boolean;
};

export type Comment = Tables<"comments"> & {
  author_name: string;
  author_avatar: string;
  author_is_verified: boolean;
  author_role: Enums<"app_role">;
  liked_by_user: boolean;
};

interface CommunityContextType {
  posts: Post[];
  comments: Comment[];
  addPost: (content: string, media?: { type: "image" | "video"; url: string }) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getCommentsForPost: (postId: string) => Comment[];
  loading: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCommunityData = async () => {
    setLoading(true);
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey(
            name,
            avatar_url,
            kyc_status
          ),
          likes_count:post_likes(count),
          comments_count:comments(count)
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const formattedPosts: Post[] = postsData.map((post: any) => ({
        ...post,
        author_name: post.author?.name || "Unknown User",
        author_avatar: post.author?.avatar_url || "/default-avatar.png",
        author_is_verified: post.author?.kyc_status === "verified",
        author_role: post.author?.kyc_status === "verified" ? "seller" : "general", // Simplified role logic
        likes_count: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0,
        liked_by_user: false, // Will be updated by RLS or separate query
      }));
      setPosts(formattedPosts);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          author:profiles!comments_author_id_fkey(
            name,
            avatar_url,
            kyc_status
          )
        `)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      const formattedComments: Comment[] = commentsData.map((comment: any) => ({
        ...comment,
        author_name: comment.author?.name || "Unknown User",
        author_avatar: comment.author?.avatar_url || "/default-avatar.png",
        author_is_verified: comment.author?.kyc_status === "verified",
        author_role: comment.author?.kyc_status === "verified" ? "seller" : "general", // Simplified role logic
        liked_by_user: false, // Will be updated by RLS or separate query
      }));
      setComments(formattedComments);

    } catch (error) {
      console.error("Error fetching community data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();

    const postsChannel = supabase
      .channel("posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => fetchCommunityData())
      .subscribe();

    const commentsChannel = supabase
      .channel("comments")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchCommunityData())
      .subscribe();

    const postLikesChannel = supabase
      .channel("post_likes")
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => fetchCommunityData())
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(postLikesChannel);
    };
  }, [user]);

  const addPost = async (content: string, media?: { type: "image" | "video"; url: string }) => {
    if (!user) throw new Error("User not authenticated.");

    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        content,
        media_type: media?.type,
        media_url: media?.url,
      })
      .select()
      .single();

    if (error) throw error;
    fetchCommunityData(); // Re-fetch to get full post data with counts and author info
  };

  const likePost = async (postId: string) => {
    if (!user) throw new Error("User not authenticated.");

    // Check if user already liked the post
    const { data: existingLike, error: likeError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (likeError && likeError.code !== "PGRST116") throw likeError; // PGRST116 means no rows found

    if (existingLike) {
      // Unlike post
      const { error } = await supabase.from("post_likes").delete().eq("id", existingLike.id);
      if (error) throw error;
    } else {
      // Like post
      const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      if (error) throw error;
    }
    fetchCommunityData(); // Re-fetch to update like counts
  };

  const deletePost = async (postId: string) => {
    if (!user) throw new Error("User not authenticated.");

    const { error } = await supabase.from("posts").delete().eq("id", postId).eq("author_id", user.id);
    if (error) throw error;
    fetchCommunityData(); // Re-fetch to remove deleted post
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) throw new Error("User not authenticated.");

    const { error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    fetchCommunityData(); // Re-fetch to update comment counts and display new comment
  };

  const likeComment = async (commentId: string) => {
    // Supabase schema does not currently support comment likes, so this will be a no-op or a local state change
    console.warn("Comment liking is not yet implemented in Supabase schema.");
  };

  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error("User not authenticated.");

    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("author_id", user.id);
    if (error) throw error;
    fetchCommunityData(); // Re-fetch to update comment counts and remove deleted comment
  };

  const getCommentsForPost = (postId: string) => {
    return comments.filter((comment) => comment.post_id === postId);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        comments,
        addPost,
        likePost,
        deletePost,
        addComment,
        likeComment,
        deleteComment,
        getCommentsForPost,
        loading,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
