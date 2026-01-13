// ScriptInjection.tsx
import React from 'react';

interface ScriptInjectionProps {
  googleScript?: string;
  facebookScript?: string;
  googleNoScript?: string;
  facebookNoScript?: string;
}

const ScriptInjection: React.FC<ScriptInjectionProps> = ({
  googleScript,
  facebookScript,
  googleNoScript,
  facebookNoScript,
}) => {
  return (
    <>
      {/* Google Tag Manager Script */}
      {googleScript && (
        <script dangerouslySetInnerHTML={{ __html: googleScript }} />
      )}
      
      {/* Facebook Pixel Script */}
      {facebookScript && (
        <script dangerouslySetInnerHTML={{ __html: facebookScript }} />
      )}
      
      {/* Google Tag Manager noscript */}
      {googleNoScript && (
        <noscript dangerouslySetInnerHTML={{ __html: googleNoScript }} />
      )}
      
      {/* Facebook Pixel noscript */}
      {facebookNoScript && (
        <noscript dangerouslySetInnerHTML={{ __html: facebookNoScript }} />
      )}
    </>
  );
};

export default ScriptInjection;