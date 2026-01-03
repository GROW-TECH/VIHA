declare module 'qrcode.react' {
  import * as React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    fgColor?: string;
    bgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
  }

  export default class QRCode extends React.Component<QRCodeProps> {}
}
