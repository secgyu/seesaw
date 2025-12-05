import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { SIZE_CHART_WOMEN } from "@/lib/constants";

export default function SizeGuidePage() {
  return (
    <>
      <Navigation />
      <CartSidebar />
      <main className="pt-24">
        <div className="px-8 lg:px-12 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-extralight tracking-tight mb-4">Size Guide</h1>
            <p className="text-sm font-light text-muted-foreground mb-16">
              Find your perfect fit with our comprehensive size charts.
            </p>
            <section className="mb-16">
              <h2 className="text-lg font-light mb-6">How to Measure</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm font-light mb-2">Bust / Chest</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    Measure around the fullest part of your bust/chest, keeping the tape horizontal.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-light mb-2">Waist</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    Measure around your natural waistline, keeping the tape comfortably loose.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-light mb-2">Hips</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    Measure around the fullest part of your hips, approximately 20cm below your waist.
                  </p>
                </div>
              </div>
            </section>
            <section className="mb-16">
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Women&apos;s Sizes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {SIZE_CHART_WOMEN.headers.map((header, index) => (
                        <th
                          key={index}
                          className="text-left text-sm font-light p-4 border-b border-black/10 bg-secondary/30"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART_WOMEN.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`text-sm font-light p-4 border-b border-black/5 ${
                              cellIndex === 0 ? "text-muted-foreground" : ""
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="mb-16">
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase mb-6">Men&apos;s Sizes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </section>
            <section className="mb-16">
              <h2 className="text-lg font-light mb-6">Fit Guide</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-light">Slim Fit</span>
                  </div>
                  <p className="text-sm font-light text-muted-foreground">
                    Follows the body&apos;s natural contours. If you&apos;re between sizes, we recommend sizing up.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-light">Regular Fit</span>
                  </div>
                  <p className="text-sm font-light text-muted-foreground">
                    Classic fit with room for comfort. True to size for most body types.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm font-light">Oversized</span>
                  </div>
                  <p className="text-sm font-light text-muted-foreground">
                    Intentionally relaxed silhouette. Consider sizing down for a less dramatic look.
                  </p>
                </div>
              </div>
            </section>
            <div className="p-8 bg-secondary/30">
              <h3 className="text-lg font-light mb-2">Need Help?</h3>
              <p className="text-sm font-light text-muted-foreground mb-4">
                Our styling team is available to help you find your perfect size.
              </p>
              <a
                href="mailto:fit@seesaw.com"
                className="inline-block text-[11px] font-light tracking-[0.2em] uppercase border-b border-black pb-1"
              >
                Contact Fit Specialists
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
