import React from 'react';
import { ComponentType } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Retrieve or initialize global data
declare global {
  interface Window {
	ucpReactData: Record<string, any>;
  }
}
const ucpReactData = window.ucpReactData || {};
console.log(ucpReactData);

// Store references to rendered roots
const renderedRoots: Record<string, Root> = {};

export default function ReactRender(Children: ComponentType<any>) {
  // Get the DOM node based on the react_id from ucpReactData
  const domNode = document.getElementById(ucpReactData.react_id);
  // Check if a root already exists for this react_id, or create a new one
  let root = renderedRoots[ucpReactData.react_id] || null;
  if (domNode && !root) {
    root = createRoot(domNode);
    renderedRoots[ucpReactData.react_id] = root;
  }

  // Render the React component
  if (root) {
	  root.render(<Children {...ucpReactData} />);
	  console.log('React component rendered');
  }
}
