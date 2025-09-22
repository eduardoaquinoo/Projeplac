import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Bold, Italic, Link, Image, Type } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function RichTextEditor({ value, onChange, placeholder, maxLength = 1000 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    
    if (newText.length <= maxLength) {
      onChange(newText);
      
      // Restaurar foco e posição do cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleBold = () => {
    insertText("**", "**", "texto em negrito");
  };

  const handleItalic = () => {
    insertText("*", "*", "texto em itálico");
  };

  const handleLinkSubmit = () => {
    if (linkText && linkUrl) {
      insertText(`[${linkText}](${linkUrl})`);
      setLinkText("");
      setLinkUrl("");
      setIsLinkModalOpen(false);
    }
  };

  const handleImageSubmit = () => {
    if (imageUrl) {
      const altText = imageAlt || "Imagem";
      insertText(`![${altText}](${imageUrl})`);
      setImageUrl("");
      setImageAlt("");
      setIsImageModalOpen(false);
    }
  };

  const charactersLeft = maxLength - value.length;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsLinkModalOpen(true)}
          className="h-8 w-8 p-0"
          title="Inserir Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsImageModalOpen(true)}
          className="h-8 w-8 p-0"
          title="Inserir Imagem"
        >
          <Image className="h-4 w-4" />
        </Button>
        
        <div className="flex-1" />
        
        <span className={`text-sm ${charactersLeft < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {charactersLeft} caracteres restantes
        </span>
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        className="bg-input-background border-border focus:border-primary focus:ring-primary min-h-40 resize-y font-mono text-sm"
        maxLength={maxLength}
      />

      {/* Preview */}
      {value && (
        <div className="p-3 border border-border rounded-md bg-muted/10">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Pré-visualização:
          </Label>
          <div 
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{
              __html: value
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
                .replace(/\n/g, '<br />')
            }}
          />
        </div>
      )}

      {/* Modal para Link */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Inserir Link</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText">Texto do Link</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ex: Visite nosso site"
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">URL do Link</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Ex: https://exemplo.com"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleLinkSubmit} className="flex-1">
                  Inserir
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsLinkModalOpen(false);
                    setLinkText("");
                    setLinkUrl("");
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Imagem */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Inserir Imagem</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Texto Alternativo (opcional)</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Ex: Descrição da imagem"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleImageSubmit} className="flex-1">
                  Inserir
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsImageModalOpen(false);
                    setImageUrl("");
                    setImageAlt("");
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}