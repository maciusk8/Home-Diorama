import dioramaImage from '@/../assets/HAdiorama_transparent.png';
import './HomeView.css';

export default function HomeView() {
    return (
        <div className="home-container">
            <div className="home-image-container">
                <img src={dioramaImage} alt="Home Assistant Diorama" className="home-image" />
            </div>
            <div className="home-content">
                <p className="home-subtitle">Select a room from the navigation bar above to start exploring</p>
            </div>
        </div>
    );
}
