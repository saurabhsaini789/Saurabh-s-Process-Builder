import React, { useState, useRef } from 'react';
import { FileImage, FileText, ZoomIn, ZoomOut, Maximize, Type, Upload, X } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const Toolbar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [processTitle, setProcessTitle] = useState('Untitled Process');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const exportAsPng = async () => {
    const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
    if (!canvasElement) return;

    try {
      // 1. Capture the diagram
      const diagramDataUrl = await toPng(canvasElement, {
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        filter: (node) => {
          const exclusionClasses = ['react-flow__controls', 'react-flow__panel', 'toolbar', 'react-flow__minimap'];
          if (node.classList) {
            return !exclusionClasses.some(cls => node.classList.contains(cls));
          }
          return true;
        },
      });

      // 2. Create a canvas to compose everything
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = diagramDataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const brandingHeight = 120;
      const footerHeight = 40;
      const padding = 40;
      
      canvas.width = img.width;
      canvas.height = img.height + (brandingHeight + footerHeight) * 2; // *2 because of pixelRatio 2

      // Fill background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Header Branding
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.fillText(processTitle, padding, 80);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText(`Created: ${new Date().toLocaleDateString()}`, padding, 120);

      // Draw Logo if exists
      if (logoUrl) {
        const logo = new Image();
        logo.src = logoUrl;
        await new Promise((resolve) => {
          logo.onload = resolve;
        });
        const logoHeight = 80;
        const logoWidth = (logo.width / logo.height) * logoHeight;
        ctx.drawImage(logo, canvas.width - logoWidth - padding, 40, logoWidth, logoHeight);
      }

      // Draw Diagram
      ctx.drawImage(img, 0, brandingHeight * 2);

      // Draw Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText("Created by Saurabh's Process Builder", padding, canvas.height - 40);

      // Export
      const finalDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = finalDataUrl;
      link.download = `${processTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.click();

    } catch (err) {
      console.error('PNG Export failed', err);
    }
  };

  const exportAsPdf = async () => {
    const canvasElement = document.querySelector('.canvas-container') as HTMLElement;
    if (!canvasElement) return;

    try {
      // Capture diagram
      const diagramDataUrl = await toPng(canvasElement, {
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        filter: (node) => {
          const exclusionClasses = ['react-flow__controls', 'react-flow__panel', 'toolbar', 'react-flow__minimap'];
          if (node.classList) {
            return !exclusionClasses.some(cls => node.classList.contains(cls));
          }
          return true;
        },
      });

      const pdf = new jsPDF({
        orientation: 'l',
        unit: 'px',
        format: [canvasElement.offsetWidth, canvasElement.offsetHeight + 100]
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Background
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.text(processTitle, 20, 40);
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Created: ${new Date().toLocaleDateString()}`, 20, 55);

      // Logo
      if (logoUrl) {
        try {
          pdf.addImage(logoUrl, 'PNG', pageWidth - 120, 20, 100, 40, undefined, 'FAST');
        } catch (e) {
          console.warn('Logo PDF add failed', e);
        }
      }

      // Diagram
      pdf.addImage(diagramDataUrl, 'PNG', 0, 80, canvasElement.offsetWidth, canvasElement.offsetHeight);

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Created by Saurabh's Process Builder", 20, pageHeight - 10);

      pdf.save(`${processTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);

    } catch (err) {
      console.error('PDF Export failed', err);
    }
  };

  return (
    <div className="toolbar-container">
      <div className="toolbar">
        <button className="toolbar-btn" onClick={() => zoomIn()} title="Zoom In">
          <ZoomIn size={20} />
        </button>
        <button className="toolbar-btn" onClick={() => zoomOut()} title="Zoom Out">
          <ZoomOut size={20} />
        </button>
        <button className="toolbar-btn" onClick={() => fitView()} title="Fit View">
          <Maximize size={20} />
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button 
          className={`toolbar-btn ${isBrandingOpen ? 'active' : ''}`} 
          onClick={() => setIsBrandingOpen(!isBrandingOpen)} 
          title="Branding & Title"
        >
          <Type size={20} />
        </button>

        <div className="toolbar-divider"></div>
        
        <button className="toolbar-btn" onClick={exportAsPng} title="Export as PNG">
          <FileImage size={20} />
        </button>
        <button className="toolbar-btn" onClick={exportAsPdf} title="Export as PDF">
          <FileText size={20} />
        </button>
      </div>

      {isBrandingOpen && (
        <div className="branding-popover">
          <div className="branding-header">
            <h3>Export Branding</h3>
            <button className="close-btn" onClick={() => setIsBrandingOpen(false)}>
              <X size={16} />
            </button>
          </div>
          
          <div className="branding-field">
            <label>Process Title</label>
            <input 
              type="text" 
              value={processTitle} 
              onChange={(e) => setProcessTitle(e.target.value)}
              placeholder="Enter title..."
            />
          </div>

          <div className="branding-field">
            <label>Logo (Optional)</label>
            {!logoUrl ? (
              <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} />
                Upload Logo
              </button>
            ) : (
              <div className="logo-preview-container">
                <img src={logoUrl} alt="Logo Preview" className="logo-preview" />
                <button className="remove-logo-btn" onClick={removeLogo}>
                  <X size={12} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              accept="image/*" 
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
