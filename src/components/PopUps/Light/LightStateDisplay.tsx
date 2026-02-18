
export default function LightStateDisplay({ brightnessPct, timeAgo }: { brightnessPct: number, timeAgo: string }) {
    return (
        <div className="light-state-container">
            <h2 className="entity-state-text">{brightnessPct}%</h2>
            <p className="entity-state-subtext">{timeAgo}</p>
        </div>
    );
}
