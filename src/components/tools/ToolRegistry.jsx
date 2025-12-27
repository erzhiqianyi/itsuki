import AnkiMock from './AnkiMock.jsx';
import ReadingMock  from "./JapaneseReadingMock.jsx";
const TOOLS = {
    'AnkiMock': AnkiMock,
    'ReadingMock': ReadingMock
};

export default function ToolRegistry({ componentId }) {
    const Component = TOOLS[componentId];
    if (!Component) return <div className="text-red-400">Component {componentId} not found.</div>;
    return <Component />;
}