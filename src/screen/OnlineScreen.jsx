import { useState, useEffect, useMemo } from 'react';
import { THEMES, SLIDES, AGENCIES } from '../data/onlineData';
import OnlineHeader from '../globalComponents/Header';
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
	const [currentThemeKey, setCurrentThemeKey] = useState('vertBlanc');
	const [showThemePicker, setShowThemePicker] = useState(false);
	const theme = useMemo(() => THEMES[currentThemeKey], [currentThemeKey]);

	// Carrousel publicitaire
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Modales ('ticket' | 'satisfaction' | 'map' | null)
	const [activeModal, setActiveModal] = useState(null);

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

	// Gestion intelligente des liens de slides (redirection externe ou ouverture de modales)
	const handleSlideClick = (slide, index, e) => {
		if (onSlideAction) {
			onSlideAction(slide, index, e);
			return;
		}

		const targetLink = slide?.link || slide?.url || (slideLinks && slideLinks[slide?.id]);
		if (targetLink === '#ticket') {
			e?.preventDefault();
			setActiveModal('ticket');
		} else if (targetLink === '#satisfaction') {
			e?.preventDefault();
			setActiveModal('satisfaction');
		} else if (targetLink === '#map') {
			e?.preventDefault();
			setActiveModal('map');
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 text-slate-900 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
			{/* En-tête / Header */}
			<OnlineHeader
				theme={theme}
				currentThemeKey={currentThemeKey}
				setCurrentThemeKey={setCurrentThemeKey}
				showThemePicker={showThemePicker}
				setShowThemePicker={setShowThemePicker}
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

				{/* 2. SECTION DES CARTES DE SERVICES (EN DESSOUS DU CARROUSEL) */}
				<OnlineServiceCards
					theme={theme}
					onSelectService={(service) => setActiveModal(service)}
				/>
			</main>

			{/* Pied de page / Footer */}
			<OnlineFooter
				theme={theme}
				currentThemeKey={currentThemeKey}
				setCurrentThemeKey={setCurrentThemeKey}
				themes={THEMES}
				onSelectService={(service) => setActiveModal(service)}
			/>

			{/* Modales dédiées aux 3 services */}
			<TicketModal
				isOpen={activeModal === 'ticket'}
				onClose={() => setActiveModal(null)}
				theme={theme}
				agencies={AGENCIES}
			/>

			<SatisfactionModal
				isOpen={activeModal === 'satisfaction'}
				onClose={() => setActiveModal(null)}
				theme={theme}
			/>

			<AgencyMapModal
				isOpen={activeModal === 'map'}
				onClose={() => setActiveModal(null)}
				theme={theme}
				agencies={AGENCIES}
			/>
		</div>
	);
}
