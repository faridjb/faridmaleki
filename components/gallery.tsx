'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog } from '@base-ui/react/dialog';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';

import type { GalleryImage } from '@/types/content';
import { withBasePath } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface GalleryProps {
  images: GalleryImage[];
}

/**
 * Renders nothing when `images` is empty — no broken-image icon, no empty box. The
 * moment `{ src, caption }` entries are added to a project's `gallery` array, this
 * renders the responsive grid + keyboard-accessible lightbox with zero code changes.
 */
export function Gallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const activeImage = activeIndex !== null ? images[activeIndex] : undefined;
  const hasMultiple = images.length > 1;

  function showPrevious() {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length
    );
  }

  function showNext() {
    setActiveIndex((current) => (current === null ? null : (current + 1) % images.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={image.caption ? `View image: ${image.caption}` : 'View image'}
            className="border-border focus-visible:ring-ring group overflow-hidden rounded-xl border text-left focus-visible:ring-2"
          >
            <div className="bg-card relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={withBasePath(image.src)}
                alt={image.caption ?? ''}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            {image.caption && (
              <p className="text-muted-foreground bg-card px-2 py-1.5 font-mono text-xs">
                {image.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      <Dialog.Root
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup className="fixed inset-4 z-50 flex items-center justify-center outline-none sm:inset-10">
            {activeImage && (
              <figure className="flex max-h-full max-w-full flex-col items-center gap-3">
                <div className="relative h-[70vh] w-[90vw] max-w-3xl">
                  <Image
                    src={withBasePath(activeImage.src)}
                    alt={activeImage.caption ?? ''}
                    fill
                    className="object-contain"
                  />
                </div>
                {activeImage.caption && (
                  <figcaption className="text-muted-foreground font-mono text-sm">
                    {activeImage.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close gallery"
                  className="absolute top-4 right-4"
                />
              }
            >
              <XIcon />
            </Dialog.Close>

            {hasMultiple && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Previous image"
                  onClick={showPrevious}
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Next image"
                  onClick={showNext}
                  className="absolute top-1/2 right-4 -translate-y-1/2"
                >
                  <ChevronRightIcon />
                </Button>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
