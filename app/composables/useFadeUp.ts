/**
 * Shared IntersectionObserver for fade-up scroll animations.
 * Observes all `.fade-up` elements in the current page and adds
 * the `visible` class once they enter the viewport.
 */
export function useFadeUp() {
  onMounted(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
  });
}
