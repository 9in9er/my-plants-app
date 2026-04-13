import { useEffect } from "react";

const METRIKA_ID = process.env.REACT_APP_YANDEX_METRIKA_ID;

export default function YandexMetrika() {  
  useEffect(() => {
    if (!METRIKA_ID) return;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
      m[i].l = 1 * new Date();

      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }

      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    

    window.ym(Number(METRIKA_ID), "init", {
      webvisor: true,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }, []);

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
}
