interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24">
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${star}`}>
                    <stop offset="50%" stopColor="#2d9e5c" />
                    <stop offset="50%" stopColor="#e0e0e0" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${star})`}
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </>
            ) : (
              <path
                fill={filled ? "#2d9e5c" : "#e0e0e0"}
                stroke="#1a1a1a"
                strokeWidth="1.5"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}
