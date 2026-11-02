import { demoFor } from "@/components/demos";
import { PinnedMoment } from "@/components/motion/PinnedMoment";
import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/ui/Label";
import { pad2 } from "@/components/ui/format";
import { deliverables } from "@/content/copy";
import { DeliverablesProgress, LIST_ID } from "./DeliverablesProgress";

const total = deliverables.items.length;

/** The five deliverables. On screens with room, each one pins as its own moment. */
export function Deliverables() {
  return (
    <section id="deliverables" aria-labelledby="deliverables-title">
      <div className="section section--paper deliverables-intro">
        <div className="container">
          <Reveal>
            <Label index={deliverables.index}>{deliverables.label}</Label>
            <h2 id="deliverables-title" className="h2 deliverables-heading">
              {deliverables.heading}
            </h2>
          </Reveal>
        </div>
      </div>

      <div id={LIST_ID}>
        {deliverables.items.map((item, i) => {
          const Demo = demoFor[item.id];
          return (
            <PinnedMoment key={item.id} className="deliverable" labelledBy={`deliverable-${item.id}`}>
              <div className="container grid deliverable-inner">
                <p className="deliverable-index col-2" data-pin-part>
                  <span className="visually-hidden">
                    {deliverables.progressLabel} {i + 1} {deliverables.progressOf} {total}:{" "}
                  </span>
                  <span aria-hidden="true">{pad2(i + 1)}</span>
                </p>
                <div className="col-4" data-pin-part>
                  <h3 id={`deliverable-${item.id}`} className="h3 deliverable-name">
                    {item.name}
                  </h3>
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
