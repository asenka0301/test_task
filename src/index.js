import "./sass/style.scss";
import { COURSES_NAV_ITEMS, COURSES } from "./config";
import { getBadgeColorClass } from "./utils";

const ALL_CATEGORY = "All";
let activeCategory = ALL_CATEGORY;
const coursesNav = document.querySelector(".js-courses-nav");
const coursesContainer = document.querySelector(".js-courses-lists");
const coursesSearchForm = document.querySelector(".js-courses-search");
const coursesSearchInput = document.querySelector(".js-courses__search-input");
let searchTerm = "";

const createNavItem = ({ label, count }, isActive) => {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.className = "courses__toolbar-nav-item";
  if (isActive) {
    const color = getBadgeColorClass(label);
    button.classList.add(`courses__toolbar-nav-item--active-${color}`);
  }
  button.dataset.category = label;
  button.innerHTML = `${label} <sup>${count}</sup>`;
  li.append(button);
  return li;
};

const renderCourses = (courses) => {
  coursesContainer.innerHTML = "";

  courses.forEach(({ title, category, image, price, author }) => {
    const article = document.createElement("article");
    article.classList.add("courses__card");

    const img = document.createElement("img");
    img.setAttribute("src", image);
    img.classList.add("courses__card-img");

    const container = document.createElement("div");
    container.classList.add("courses__card-info-container");

    const span = document.createElement("span");
    span.classList.add("courses__card-badge");
    const colorBadge = getBadgeColorClass(category);
    span.classList.add(`courses__card-badge--${colorBadge}`);
    span.textContent = category;

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("courses__card-title");
    cardTitle.textContent = title;

    const info = document.createElement("div");
    info.classList.add("courses__card-info");
    info.innerHTML = `<span class="courses__card-info--price">${price}</span> | by ${author}`;

    container.append(span, cardTitle, info);
    article.append(img, container);
    coursesContainer.append(article);
  });
};

const renderNav = (navItems) => {
  coursesNav.innerHTML = "";
  navItems.forEach((item, index) => {
    const navItem = createNavItem(item, index === 0);
    coursesNav.append(navItem);
  });
};

const buildNavItems = () => {
  const counts = COURSES.reduce((acc, { category }) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return [
    { label: ALL_CATEGORY, count: COURSES.length },
    ...COURSES_NAV_ITEMS.map((category) => ({
      label: category,
      count: counts[category] || 0,
    })),
  ];
};

const getFilteredCourses = () => {
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return COURSES.filter(({ category, title }) => {
    const matchesCategory =
      activeCategory === ALL_CATEGORY || category === activeCategory;

    if (!normalizedQuery) return matchesCategory;

    const text = title.toLowerCase();
    return matchesCategory && text.includes(normalizedQuery);
  });
};

const renderFilteredCourses = () => {
  renderCourses(getFilteredCourses());
};

const setActiveButton = (currentButton) => {
  const buttons = coursesNav.querySelectorAll(".courses__toolbar-nav-item");
  buttons.forEach((button) => {
    const activeCategory = getBadgeColorClass(button.dataset.category);
    button.classList.toggle(
      `courses__toolbar-nav-item--active-${activeCategory}`,
      button === currentButton
    );
  });
};

const handleNavClick = (event) => {
  const button = event.target.closest(".courses__toolbar-nav-item");
  if (!button) return;

  const { category } = button.dataset;
  activeCategory = category;
  setActiveButton(button);

  renderFilteredCourses();
};

const handleSearchInput = (event) => {
  searchTerm = event.target.value;
  renderFilteredCourses();
};

const handleSearchSubmit = (event) => {
  event.preventDefault();
};

const init = () => {
  const navItems = buildNavItems();
  renderNav(navItems);
  renderFilteredCourses();
  coursesNav.addEventListener("click", handleNavClick);
  coursesSearchInput.addEventListener("input", handleSearchInput);
  coursesSearchForm.addEventListener("submit", handleSearchSubmit);
};

init();
