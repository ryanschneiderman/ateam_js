import React from "react";
import { DiagramProvider } from "./Context/DiagramContext";
import Diagram from "./Diagram/Diagram";

export default function PlayDiagrammingApp() {
    return (
        <DiagramProvider>
            <Diagram />
        </DiagramProvider>
    );
}
