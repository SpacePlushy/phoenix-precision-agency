export default function ThemeDemoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Dark Mode Demo</h1>
      
      <div className="grid gap-8">
        {/* Color Showcase */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Background</p>
              <p className="font-medium">Default</p>
            </div>
            <div className="p-4 bg-primary text-primary-foreground rounded-lg">
              <p className="text-sm opacity-80">Primary</p>
              <p className="font-medium">Action</p>
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded-lg">
              <p className="text-sm opacity-80">Accent</p>
              <p className="font-medium">Highlight</p>
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-lg">
              <p className="text-sm">Muted</p>
              <p className="font-medium">Subtle</p>
            </div>
          </div>
        </section>

        {/* Components Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Components</h2>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-2">Card Component</h3>
            <p className="text-muted-foreground mb-4">
              This is how cards look in both light and dark modes. The theme automatically
              adjusts colors for optimal readability.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity">
                Secondary Button
              </button>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <div className="prose dark:prose-invert">
            <p>Regular paragraph text adapts to the current theme.</p>
            <p className="text-muted-foreground">Muted text for less emphasis.</p>
            <p className="text-accent">Accent colored text for highlights.</p>
          </div>
        </section>

        {/* Custom Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Aerospace Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--gold)] text-white rounded-lg">
              <p className="font-medium">Gold</p>
            </div>
            <div className="p-4 bg-[var(--sage)] text-white rounded-lg">
              <p className="font-medium">Sage</p>
            </div>
            <div className="p-4 bg-[var(--cool-gray)] text-white rounded-lg">
              <p className="font-medium">Cool Gray</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}