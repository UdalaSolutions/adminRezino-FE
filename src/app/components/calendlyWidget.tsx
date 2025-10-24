import { InlineWidget } from 'react-calendly';

const CalendlyWidget = () => {
	return (
		<div className='h-fit'>
			<InlineWidget url='https://calendly.com/rezino_skincare' />
		</div>
	);
};

export default CalendlyWidget;
