import { demoFor } from "@/components/demos";
import { PinnedMoment } from "@/components/motion/PinnedMoment";
import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { deliverables } from "@/content/copy";
import { DeliverablesProgress } from "./DeliverablesProgress";

const total = deliverables.items.length;

/** The five deliverables. Each one is its own pinned moment on wide screens. */
export function Deliverables() {
  return (
    <section id="deliverables" className="deliverables" aria-labelledby="deliverables-title">
      <div className="section section--paper deliverables-intro">
        <div className="container">
          <Reveal>
            <Label>{deliverables.label}</Label>
            <h2 id="deliverables-title" className="h2 deliverables-heading">
              {deliverables.heading}
            </h2>
          </Reveal>
        </div>
      </div>

      <div id="deliverables-list" className="deliverables-list">
        {deliverables.items.map((item, i) => {
          const Demo = demoFor[item.id];
          return (
            <PinnedMoment key={item.id} className="deliverable" labelledBy={`deliverable-${item.id}`} hold={0.55}>
              <div data-deliverable className="container grid deliverable-inner">
                <p className="deliverable-index col-2" data-pin-part>
                  <span className="visually-hidden">
                    {deliverables.progressLabel} {i + 1} {deliverables.progressOf} {total}:{" "}
                  </span>
                  <span aria-hidden="true">{item.index}</span>
                  <span className="deliverable-of" aria-hidden="true">
                    {i + 1}/{total}
                  </span>
                </p>
                <div className="deliverable-text col-4" data-pin-part>
                  <h3 id={`deliverable-${item.id}`} className="h3 deliverable-name">{item.name}</h3>
                  <p className="body deliverable-body">{item.body}</p>
                </div>
                <div className="deliverable-demo col-6" data-pin-part>
                  <Demo />
                </div>
              </div>
            </PinnedMoment>
          );
        })}
      </div>
      <DeliverablesProgress />
    </section>
  );
}
