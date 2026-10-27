import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { THEMES } from '../theme/themes';
import { SLIDES } from '../mocks/slidesMock';
import { AGENCIES } from '../mocks/agenciesMock';
import { setTheme } from '../features/themeSlice';
import { openModal, closeModal } from '../features/modalSlice';

import Header from '../globalComponents/Header';
import OnlineHero from '../globalComponents/Hero';
import OnlineServiceCards from '../globalComponents/ServiceCards';
import OnlineFooter from '../globalComponents/Footer';
import TicketModal from '../globalComponents/TicketModal';
import SatisfactionModal from '../globalComponents/SatisfactionModal';
import AgencyMapModal from '../globalComponents/AgencyMapModal';

export { THEMES, SLIDES, AGENCIES, OnlineScreen, OnlineScreen as OnlinePage };

export default function OnlineScreen({
	slides = SLIDES,
	slideLinks,
	onSlideAction
}) {
	const dispatch = useDispatch();

	// Données issues du Store Redux
	const theme = useSelector((state) => state.theme.theme);
	const currentThemeKey = useSelector((state) => state.theme.currentThemeKey);
	const activeModal = useSelector((state) => state.modal.activeModal);

	// Carrousel publicitaire
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Rotation automatique du carrousel de pub
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

	// Gestion des clics sur slides (redirection externe ou ouverture de modales)
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
		<div className="min-h-screen bg-slate-900 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
			{/* En-tête / Header */}
			<Header
				theme={theme}
				currentThemeKey={currentThemeKey}
				onThemeChange={(key) => dispatch(setTheme(key))}
				themes={THEMES}
			/>

			{/* Contenu Principal */}
			<main className="flex-1 flex flex-col w-full">
				{/* 1. SECTION DU CARROUSEL BANNIÈRE */}
				<section className="w-full">
					<OnlineHero
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
				</section>

				{/* 2. SECTION DES CARTES DE SERVICES */}
				<OnlineServiceCards
					theme={theme}
					onSelectService={(service) => dispatch(openModal(service))}
				/>
			</main>

			{/* Pied de page / Footer */}
			<OnlineFooter
				theme={theme}
				currentThemeKey={currentThemeKey}
				setCurrentThemeKey={(key) => dispatch(setTheme(key))}
				themes={THEMES}
				onSelectService={(service) => dispatch(openModal(service))}
			/>

			{/* Modales dédiées aux 3 services */}
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
		</div>
	);
}
