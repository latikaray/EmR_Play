import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Brush, Eraser, Palette, Trash2, CheckCircle2, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const colors = [
  { label: "Primary", className: "bg-primary" },
  { label: "Secondary", className: "bg-secondary" },
  { label: "Accent", className: "bg-accent" },
  { label: "Fun Pink", className: "bg-fun-pink" },
  { label: "Fun Yellow", className: "bg-fun-yellow" },
  { label: "Fun Teal", className: "bg-fun-teal" },
  { label: "Fun Orange", className: "bg-fun-orange" },
  { label: "Muted", className: "bg-muted" },
  { label: "Foreground", className: "bg-foreground" }
];

const DrawMoodPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(6);
  const [useEraser, setUseEraser] = useState(false);
  const { user } = useAuth();
  const bgColorRef = useRef<string>("#ffffff");

  // Resize canvas to container with devicePixelRatio support
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      // Fill with background to avoid transparency when saving
      const tmp = document.createElement('div');
      tmp.className = 'bg-card hidden';
      document.body.appendChild(tmp);
      const bg = getComputedStyle(tmp).backgroundColor;
      document.body.removeChild(tmp);
      bgColorRef.current = bg || "#ffffff";
      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    document.title = "Draw Your Mood | EMR Play";
  }, []);

  useEffect(() => {
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getCtx = () => canvasRef.current?.getContext("2d") || null;

  const getPointerPos = (e: PointerEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (e as PointerEvent).clientX - rect.left, y: (e as PointerEvent).clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const ctx = getCtx();
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    const { x, y } = getPointerPos(e.nativeEvent);
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPointerPos(e.nativeEvent);
    ctx.lineWidth = useEraser ? Math.max(strokeWidth * 2, 10) : strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = useEraser ? bgColorRef.current : strokeColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCtx();
    if (!ctx) return;
    setIsDrawing(false);
    ctx.closePath();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    // Clear to background color
    const ctxBg = bgColorRef.current || "#ffffff";
    ctx.fillStyle = ctxBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-mood-drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to save your progress");
      return;
    }
    const { error } = await supabase.from('activity_completions').insert({
      user_id: user.id,
      activity_name: 'Draw Your Mood',
      activity_type: 'creative',
      eq_trait: 'Self-Awareness',
      notes: 'Completed mood drawing'
    });
    if (error) {
      toast.error("Could not record completion");
    } else {
      toast.success("Great job! Activity recorded 🎉");
    }
  };

  const resolveSwatchColor = (el: HTMLDivElement) => {
    const style = getComputedStyle(el);
    return style.backgroundColor || '#000';
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-fun-yellow animate-float" />
            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-comic">Draw Your Mood</h1>
            <Sparkles className="h-6 w-6 text-fun-pink animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-muted-foreground font-comic">Express how you feel with colors and lines! 🎨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools */}
          <Card className="lg:col-span-1 shadow-card bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-comic text-foreground flex items-center gap-2"><Palette className="h-5 w-5 text-accent" /> Tools</CardTitle>
              <CardDescription className="font-comic">Pick a color and brush size</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-comic">Colors</p>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((c, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-full shadow hover-scale cursor-pointer ${c.className}`}
                        title={c.label}
                        onClick={(e) => {
                          const col = resolveSwatchColor(e.currentTarget as HTMLDivElement);
                          setStrokeColor(col);
                          setUseEraser(false);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Thickness */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-comic">Brush size</p>
                  <span className="text-sm font-comic text-foreground">{strokeWidth}px</span>
                </div>
                <Slider
                  value={[strokeWidth]}
                  onValueChange={(v) => setStrokeWidth(v[0])}
                  min={2}
                  max={32}
                  step={1}
                />
                <div className="flex items-center gap-2">
                  <Button variant={useEraser ? "secondary" : "outline"} size="sm" onClick={() => setUseEraser(false)} className="flex-1">
                    <Brush className="h-4 w-4 mr-1" /> Pen
                  </Button>
                  <Button variant={useEraser ? "destructive" : "outline"} size="sm" onClick={() => setUseEraser(true)} className="flex-1">
                    <Eraser className="h-4 w-4 mr-1" /> Eraser
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleClear}>
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button className="col-span-2" variant="activity" onClick={handleComplete}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Save & Complete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="lg:col-span-3 shadow-activity bg-card/80 backdrop-blur border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="font-comic text-foreground">Your Canvas</CardTitle>
              <CardDescription className="font-comic">Use your finger or mouse to draw. Have fun!</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={containerRef} className="w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden border border-primary/20 bg-card">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={stopDrawing}
                  className="w-full h-full touch-none cursor-crosshair"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrawMoodPage;
