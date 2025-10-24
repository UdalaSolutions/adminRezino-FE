interface StarRatingProps {
	rating: number;
	reviews: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviews }) => (
	<div className='flex items-center gap-1 text-xs'>
		<div className='flex'>
			{[...Array(5)].map((_, i) => (
				<span
					key={i}
					className={`text-sm ${
						i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
					}`}>
					★
				</span>
			))}
		</div>
		<span className='text-foreground'>({reviews} reviews)</span>
	</div>
);

export default StarRating;
