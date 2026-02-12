import LatestPhoneBanner from "../components/LatestPhoneBanner"
import StatsSection from "../components/StatsSection"
import Header from "../components/Header"
import Footer from "../components/Footer"
import FeaturedProducts from "../components/FeaturedProducts"
import AboutIntro from "../components/AboutIntro"
import OurMission from "../components/OurMission"
import ValuesSection from "../components/ValuesSection"
import CommitmentSection from "../components/CommitmentSection"
import TestimonialsSection from "../components/TestimonialsSection"

const HomePage = () => {
    return (
        <>
            <Header />
            <LatestPhoneBanner />
            <AboutIntro />
            <OurMission />
            <ValuesSection />
            
            <FeaturedProducts />
<CommitmentSection />
            <TestimonialsSection />
                        <StatsSection />

            <Footer />
        </>
    )
}
export default HomePage

