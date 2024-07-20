import React from 'react';
import {ComponentType} from 'react';
import { createRoot } from 'react-dom/client';

// @ts-ignore
const ucpReactData = window.ucpReactData || {};
console.log(ucpReactData);
export default function ReactRender(Children : ComponentType<any>) {
	const domNode = document.getElementById(ucpReactData.react_id);
	if (domNode) {
		createRoot(domNode).render(<Children {...ucpReactData} />);
	}
}
