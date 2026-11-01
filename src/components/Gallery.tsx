'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Maximize2, X, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'Pool' | 'Kids' | 'Garden' | 'Celebrations' | 'Party Hall' | 'Dining';
  src: string;
  alt: string;
  title: string;
  highlight?: boolean;
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      category: 'Pool',
      src: '/images/pool-main.jpg',
      alt: 'Thendral Day Out swimming pool in Panpoli Tenkasi',
      title: 'Main Swimming Pool & Deck',
      highlight: true,
    },
    {
      id: '2',
      category: 'Pool',
      src: '/images/falls-feature.jpg',
      alt: 'Thendral Day Out artificial waterfall cascade feature in pool',
      title: 'Artificial Waterfall Feature',
    },
    {
      id: '3',
      category: 'Kids',
      src: '/images/kids-play.jpg',
      alt: 'Thendral Day Out kids playground with slide and swings in Panpoli Tenkasi',
      title: 'Outdoor Kids Playground & Slide',
    },
    {
      id: '4',
      category: 'Dining',
      src: '/images/dining-area.jpg',
      alt: 'Thendral Day Out outdoor dry dining picnic tables and benches in Panpoli',
      title: 'Outdoor Dining Space (Bring Your Own Food)',
    },
    {
      id: '5',
      category: 'Party Hall',
      src: '/images/party-hall.jpg',
      alt: 'Thendral Day Out celebration and party hall in Panpoli Tenkasi',
      title: 'Celebration & Birthday Party Hall',
    },
    {
      id: '6',
      category: 'Celebrations',
      src: '/images/venue-collage.jpg',
      alt: 'Thendral Day Out celebration and family gathering in Panpoli Tenkasi',
      title: 'Family Gathering & Celebration Moments',
    },
  ];

  const categories = ['All', 'Pool', 'Kids', 'Celebrations', 'Party Hall', 'Dining'];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="section-padding" style={{
      backgroundColor: '#ffffff',
      position: 'relative',
    }}>
      <div className="container">
        <div className="section-header">
          <div className="fun-eyebrow">
            <Camera size={16} />
            <span>Real Venue Photos</span>
          </div>
          <h2 className="section-title">
            SEE THE FUN WAITING FOR YOU
          </h2>
          <p className="section-desc">
            Explore our swimming pool, waterfall, kids playground, garden, and party hall in Panpoli, Tenkasi.
          </p>
        </div>

        {/* Filter Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '40px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                transition: 'all 0.25s ease',
                backgroundColor: activeCategory === cat ? 'var(--primary-blue)' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: activeCategory === cat ? '2px solid var(--primary-blue)' : '1.5px solid var(--border-light)',
                boxShadow: activeCategory === cat ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'var(--shadow-sm)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-Style Photo Grid */}
        <div className="gallery-masonry">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="gallery-tile"
              style={{
                aspectRatio: item.highlight ? '16/10' : '4/3',
                gridColumn: item.highlight ? 'span 2' : 'span 1',
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(3, 72, 112, 0.88) 0%, rgba(3, 72, 112, 0.2) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
                color: '#ffffff',
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#86efac',
                  textTransform: 'uppercase',
                  fontFamily: 'Fredoka, sans-serif',
                }}>
                  {item.category}
                </span>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}>
                  {item.title}
                </span>
              </div>
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-blue-dark)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <Maximize2 size={18} />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(3, 30, 48, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '920px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10' }}>
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  style={{ objectFit: 'contain', backgroundColor: '#021829' }}
                />
              </div>
              <div style={{
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--accent-green)',
                    textTransform: 'uppercase',
                    fontFamily: 'Fredoka, sans-serif',
                  }}>
                    {activeImage.category}
                  </span>
                  <h3 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue-dark)',
                  }}>
                    {activeImage.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {activeImage.alt}
                  </p>
                </div>
                <button
                  onClick={() => setActiveImage(null)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-light)',
                  }}
                  aria-label="Close image lightbox"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
