import React, { useEffect, useState } from 'react';
import { INSTAGRAM_POSTS } from '../data/mockData';
import { Heart, MessageCircle, Instagram } from 'lucide-react';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==';

interface InstagramFeedProps {
  studioImages?: string[];
}

const buildLiveFeedPosts = (imageUrls?: string[]) => {
  if (!imageUrls || imageUrls.length === 0) {
    return INSTAGRAM_POSTS.slice(0, 9);
  }

  return imageUrls.slice(0, 9).map((url, idx) => ({
    id: `live-${idx}`,
    imageUrl: url,
    caption: `Live studio feed ${idx + 1} — heritage couture from Yared Tibeb`,
    likes: 420 + idx * 45,
    comments: 12 + idx * 3
  }));
};

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ studioImages }) => {
  const [liveImages, setLiveImages] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchLiveFeed = async () => {
      try {
        const res = await fetch('/api/instagram-live-feed');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (Array.isArray(data.images) && data.images.length > 0) {
          setLiveImages(data.images);
        }
      } catch (err) {
        console.error('Instagram live feed fetch failed:', err);
      }
    };

    fetchLiveFeed();
  }, []);

  const validStudioImages = studioImages?.filter((url) => typeof url === 'string' && url.trim().length > 0) || [];
  const validLiveImages = liveImages?.filter((url) => typeof url === 'string' && url.trim().length > 0) || [];
  const activeImages = validStudioImages.length > 0 ? validStudioImages : validLiveImages;
  const posts = buildLiveFeedPosts(activeImages.length > 0 ? activeImages : undefined);

  return (
    <section id="instagram-feed" className="py-20 bg-[#FAF5EE] border-t border-[#ECE3D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal text-[#2C1A14] uppercase tracking-wider">
              Yared Tibeb Studio
            </h2>
            <p className="text-sm text-[#2C1A14]/70 max-w-2xl">
              Live feed imagery from the studio, updated automatically from the brand gallery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#1A0F0B] overflow-hidden shadow-md block border border-[#ECE3D4]"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-[#1A0F0B]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-[#FAF6F0]">
                <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-semibold">
                  <span>@yared_tibeb</span>
                  <Instagram size={16} />
                </div>

                <p className="text-xs text-[#FAF6F0]/90 line-clamp-3 font-sans-ui italic">
                  "{post.caption}"
                </p>

                <div className="flex items-center space-x-4 text-xs text-[#D4AF37] font-bold">
                  <div className="flex items-center space-x-1">
                    <Heart size={14} className="fill-current text-[#E1306C]" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={14} />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
