
Je l’ai fait en CSS pur, sans SVG ni image : le cercle extérieur porte une bordure translucide et un anneau intérieur via box-shadow: inset; le point doré et son halo sont un petit élément centré avec une ombre externe. Le code actuel est dans components/dashboard/synapse-home.tsx et app/synapse-home.css.


<span className="contact-mark" aria-hidden="true">
  <span className="contact-mark__dot" />
</span>

.contact-mark {
  width: 47px;
  height: 47px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  box-shadow: inset 0 0 0 7px rgba(255, 255, 255, 0.1);
}

.contact-mark__dot {
  display: block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #edb64f;
  box-shadow: 0 0 0 7px rgba(237, 182, 79, 0.13);
}

En compact, je réduis simplement le cercle à 36px et le point à 10px.