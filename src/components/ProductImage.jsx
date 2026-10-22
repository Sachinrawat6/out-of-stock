import { smallImage } from '../utils/product';

const RATIO = 'aspect-[3/4] w-full';

// Image par click karne se full image khulti hai
export default function ProductImage({ image, title, onClick }) {
  if (!image?.url) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-sm text-slate-400 ${RATIO}`}>
        No image
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View full image of ${title}`}
      className={`block cursor-zoom-in overflow-hidden bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 ${RATIO}`}
    >
      <img
        src={smallImage(image.url, 500)}
        alt={image.altText || title}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-105"
      />
    </button>
  );
}
