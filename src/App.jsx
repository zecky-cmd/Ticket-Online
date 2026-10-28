import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { THEMES } from './theme/themes';
import { SLIDES } from './mocks/slidesMock';
import { AGENCIES } from './mocks/agenciesMock';
import { openModal, closeModal } from './features/modalSlice';
import MainLayout from './layout/Layout';
import SectionLayout from './layout/SectionLayout';

import Hero from './globalComponents/Hero';
import ServiceCards from './globalComponents/ServiceCards';
import TicketModal from './globalComponents/TicketModal';
import SatisfactionModal from './globalComponents/SatisfactionModal';
import AgencyMapModal from './globalComponents/AgencyMapModal';

export { THEMES, SLIDES, AGENCIES };

export default function App({
	slides = SLIDES,
	slideLinks,
	onSlideAction
}) {
	const dispatch = useDispatch();

	const theme = useSelector((state) => state.theme.theme);
	const currentThemeKey = useSelector((state) => state.theme.currentThemeKey);
	const activeModal = useSelector((state) => state.modal.activeModal);

	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 6000);
		return () => clearInterval(interval);
	}, [isPaused, slides.length]);

	const handlePrevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const handleNextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const handleSlideClick = (slide, index, e) => {
		if (onSlideAction) {
			onSlideAction(slide, index, e);
			return;
		}

		const targetLink = slide?.link || slide?.url || (slideLinks && slideLinks[slide?.id]);
		if (targetLink === '#ticket') {
			e?.preventDefault();
			dispatch(openModal('ticket'));
		} else if (targetLink === '#satisfaction') {
			e?.preventDefault();
			dispatch(openModal('satisfaction'));
		} else if (targetLink === '#map') {
			e?.preventDefault();
			dispatch(openModal('map'));
		}
	};

	return (
		<MainLayout theme={theme} currentThemeKey={currentThemeKey} themes={THEMES}>
			<SectionLayout fullWidth={true} padding={false}>
				<Hero
					theme={theme}
					slides={slides}
					currentSlide={currentSlide}
					setCurrentSlide={setCurrentSlide}
					handlePrevSlide={handlePrevSlide}
					handleNextSlide={handleNextSlide}
					setIsPaused={setIsPaused}
					slideLinks={slideLinks}
					onSlideAction={handleSlideClick}
				/>
			</SectionLayout>

			<SectionLayout fullWidth={true} padding={false}>
				<ServiceCards
					theme={theme}
					onSelectService={(service) => dispatch(openModal(service))}
				/>
			</SectionLayout>

			<TicketModal
				isOpen={activeModal === 'ticket'}
				onClose={() => dispatch(closeModal())}
				theme={theme}
				agencies={AGENCIES}
			/>

			<SatisfactionModal
				isOpen={activeModal === 'satisfaction'}
				onClose={() => dispatch(closeModal())}
				theme={theme}
			/>

			<AgencyMapModal
				isOpen={activeModal === 'map'}
				onClose={() => dispatch(closeModal())}
				theme={theme}
				agencies={AGENCIES}
			/>
		</MainLayout>
	);
}
