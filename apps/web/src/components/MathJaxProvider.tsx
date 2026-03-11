'use client';

import { MathJaxContext } from 'better-react-mathjax';
import { ReactNode } from 'react';

interface MathJaxProviderProps {
  children: ReactNode;
}

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    packages: {
      '[+]': ['ams', 'noerrors', 'noundefined'],
    },
    processEscapes: true,
    processEnvironments: true,
  },
  svg: {
    fontCache: 'global',
    scale: 1.1,
    minScale: 0.5,
    mtextInheritFont: false,
    merrorInheritFont: false,
    mathmlSpacing: false,
    skipAttributes: {},
    exFactor: 0.5,
    displayAlign: 'center',
    displayIndent: '0',
  },
  options: {
    enableMenu: true,
    menuOptions: {
      settings: {
        zoom: 'Click',
        zoomScale: '150%',
        renderer: 'svg',
      },
    },
  },
  startup: {
    typeset: true,
  },
};

export default function MathJaxProvider({ children }: MathJaxProviderProps) {
  return (
    <MathJaxContext config={mathJaxConfig}>
      {children}
    </MathJaxContext>
  );
}
