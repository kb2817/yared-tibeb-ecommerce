import React from 'react';
import { INSTAGRAM_POSTS } from '../data/mockData';
import { Heart, MessageCircle, Instagram } from 'lucide-react';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==';

export const InstagramFeed: React.FC = () => {
  return (
    <section id="instagram-feed" className="py-20 bg-[#FAF5EE] border-t border-[#ECE3D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal text-[#2C1A14] uppercase tracking-wider">
              Yared Tibeb Studio
            </h2>
          </div>
        </div>

        {/* 9-Photo Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {INSTAGRAM_POSTS.slice(0, 9).map((post) => (
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

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#1A0F0B]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-[#FAF6F0]">
                {/* Top Badge */}
                <div className="flex items-center justify-between text-[11px] text-[#D4AF37] font-semibold">
                  <span>@yared_tibeb</span>
                  <Instagram size={16} />
                </div>

                {/* Caption Preview */}
                <p className="text-xs text-[#FAF6F0]/90 line-clamp-3 font-sans-ui italic">
                  "{post.caption}"
                </p>

                {/* Likes & Comments Count */}
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
