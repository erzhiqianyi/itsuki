import AnkiMock from './AnkiMock.jsx';
import ReadingMock  from "./JapaneseReadingMock.jsx";
import YouGuidePro  from "./YouGuidePro.jsx";
const TOOLS = {
    'AnkiMock': AnkiMock,
    'ReadingMock': ReadingMock,
    'YouGuidePro': YouGuidePro
};

export default function ToolRegistry({ componentId }) {
    const Component = TOOLS[componentId];
    if (!Component) return <div className="text-red-400">Component {componentId} not found.</div>;
    return <Component />;
}