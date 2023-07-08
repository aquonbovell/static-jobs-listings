const listings = document.createDocumentFragment();
fetch("../data.json").then((res) => {
  if (res.ok) {
    res.json().then((data) => {
      let jobs = "";
      data.forEach((job) => {
        let languages = "";
        let tools = "";
        job.languages.forEach((language) => {
          languages += `<li tabindex="0" class="cursor-pointer tag px-2 rounded-md bg-neutral-300 text-primary font-bold hover:bg-primary focus-within:bg-primary hover:text-neutral-100 focus-within:text-neutral-100">
          ${language}
        </li>`;
        });
        job.tools.forEach((tool) => {
          tools += `<li  tabindex="0" class="cursor-pointer tag px-2 rounded-md bg-neutral-300 text-primary font-bold hover:bg-primary focus-within:bg-primary hover:text-neutral-100 focus-within:text-neutral-100">
          ${tool}
        </li>`;
        });
        jobs += `<li data-id="${
          job.id
        }" class="bg-white p-6 rounded-md relative pt-10 job md:flex md:justify-between md:gap-2" ${
          job.featured ? "data-featured" : ""
        }>
        <div class="md:flex md:gap-3 md:flex-shrink-0">
        <img
          src="${job.logo}"
          alt="${job.company}"
          class="absolute w-14 -top-7 md:static md:w-28 md:flex-shrink-0"
        />
        <div class="">
        <div
          class="border-5 flex gap-3 leading-none items-baseline flex-wrap md:flex-nowrap"
        >
          <h2 class="font-bold  py-1 text-primary">${job.company}</h2>
          <span
            class="bg-primary px-3 py-1 rounded-full uppercase font-bold text-white new"
            >${job.new ? "New!" : ""}</span
          >
          <span
            class="bg-neutral-700 px-3 py-1 rounded-full uppercase font-bold text-white featured"
            >${job.featured ? "Featured" : ""}</span
          >
        </div>
        
        <h3 class="py-2 font-bold">${job.position}</h3>
        <ul
          class="flex gap-3 text-neutral-500 font-thin job-status flex-wrap pb-2 md:flex-nowrap md:w-max"
          role="list"
        >

          <li class="inline-block">${job.postedAt}</li>
          <li class="inline-block">${job.contract}</li>
          <li class="inline-block">${job.location}</li>
        </ul>
        </div>
        </div>
        <hr class="md:hidden" />
        <ul class="job-tags flex gap-4 pt-4 pb-3 flex-wrap md:self-start md:justify-end md:flex-shrink">
        <li tabindex="0" class="cursor-pointer tag px-2 rounded-md bg-neutral-300 text-primary font-bold hover:bg-primary focus-within:bg-primary hover:text-neutral-100 focus-within:text-neutral-100">
                ${job.role}
        </li>
        <li tabindex="0" class="cursor-pointer tag px-2 rounded-md bg-neutral-300 text-primary font-bold hover:bg-primary focus-within:bg-primary hover:text-neutral-100 focus-within:text-neutral-100">
                ${job.level}
        </li>
        ${languages}
        ${tools}
        </ul>
      </li>`;
      });
      document.getElementById("job-listings").innerHTML = jobs;

      const tags = document.querySelectorAll(".tag");
      tags.forEach((tag) => {
        tag.addEventListener("click", (event) => {
          const filters = document.querySelectorAll(".filter");
          let found = false;
          Array.from(filters).some((filter) => {
            if (filter.textContent.trim() === event.target.textContent.trim()) {
              found = true;
              return true;
            }
          });
          if (!found) {
            const filterBox = document.querySelector("#filters");
            const container = document.createElement("div");
            container.innerHTML = `<p class="flex gap-2 bg-neutral-300 rounded overflow-hidden">
            <span class="filter pl-4 pr-3 py-2 text-primary font-bold"
              >${event.target.textContent.trim()}</span
            >
            <button class="filter-remove bg-primary px-3">
              <img src="./images/icon-remove.svg" alt="" class="object-cover" />
            </button>
          </p>`;

            filterBox.appendChild(container.firstChild);

            const oldFilters = filterBox.querySelectorAll(".filter");
            const newFilters = [];
            oldFilters.forEach((filter) => {
              newFilters.push(filter.textContent);
            });

            newFilters.push(event.target.textContent.trim());

            const jobListings = document.querySelector("#job-listings");
            const jobsFragment = document.createDocumentFragment();
            Array.from(jobListings.children)
              .map((listing) => {
                const fields = [];
                listing.querySelectorAll(".job-tags > li").forEach((tag) => {
                  fields.push(tag.textContent.trim());
                });
                const result = newFilters.every((filter) => {
                  return fields.includes(filter);
                });
                if (result) {
                  jobsFragment.appendChild(listing);
                } else {
                  listings.appendChild(listing);
                }
              })
              .filter((child) => child !== undefined);

            while (jobListings.firstChild) {
              jobListings.firstChild.remove();
            }
            jobListings.appendChild(jobsFragment);
          }

          const filterBtns = document.querySelectorAll(".filter-remove");
          filterBtns.forEach((filterBtn) => {
            filterBtn.addEventListener("click", () => {
              const filterBox = document.querySelector("#filters");
              const filterText = filterBox.querySelectorAll(".filter");
              let location = -1;
              filterText.forEach((entry, index) => {
                if (
                  filterBtn.previousElementSibling.textContent.trim() ===
                  entry.textContent.trim()
                ) {
                  location = index;
                }
              });
              const newFiltersText = [];
              const newFilters = Array.from(filterBox.children)
                .map((child, index) => {
                  if (location != index) {
                    newFiltersText.push(child.textContent.trim());
                    return child;
                  }
                })
                .filter((child) => child !== undefined);
              const fragment = document.createDocumentFragment();

              newFilters.forEach((child) => {
                fragment.appendChild(child);
              });
              while (filterBox.firstChild) {
                filterBox.firstChild.remove();
              }
              filterBox.appendChild(fragment);

              const prevListings = document.querySelector("#job-listings");
              Array.from(prevListings.children).forEach((listing) => {
                listings.appendChild(listing);
              });
              const childNodesArray = Array.from(listings.childNodes);
              childNodesArray.sort((a, b) => {
                const idA = a.getAttribute("data-id");
                const idB = b.getAttribute("data-id");
                return idA - idB;
              });
              const newListings = document.createDocumentFragment();

              childNodesArray
                .map((listing) => {
                  const fields = [];
                  listing.querySelectorAll(".job-tags > li").forEach((tag) => {
                    fields.push(tag.textContent.trim());
                  });
                  console.log(newFiltersText);
                  console.log(fields);
                  const result = newFiltersText.every((filter) => {
                    return fields.includes(filter);
                  });
                  if (result) {
                    newListings.appendChild(listing);
                  } else {
                    listings.appendChild(listing);
                  }
                })
                .filter((child) => child !== undefined);

              prevListings.appendChild(newListings);
            });
          });
        });
        tag.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const filters = document.querySelectorAll(".filter");
            let found = false;
            Array.from(filters).some((filter) => {
              if (
                filter.textContent.trim() === event.target.textContent.trim()
              ) {
                found = true;
                return true;
              }
            });
            if (!found) {
              const filterBox = document.querySelector("#filters");
              const container = document.createElement("div");
              container.innerHTML = `<p class="flex gap-2 bg-neutral-300 rounded overflow-hidden">
            <span class="filter pl-4 pr-3 py-2 text-primary font-bold"
              >${event.target.textContent.trim()}</span
            >
            <button class="filter-remove bg-primary px-3 hover:bg-neutral-700 focus-within:bg-neutral-700">
              <img src="./images/icon-remove.svg" alt="" class="object-cover" />
            </button>
          </p>`;

              filterBox.appendChild(container.firstChild);

              const oldFilters = filterBox.querySelectorAll(".filter");
              const newFilters = [];
              oldFilters.forEach((filter) => {
                newFilters.push(filter.textContent);
              });

              newFilters.push(event.target.textContent.trim());

              const jobListings = document.querySelector("#job-listings");
              const jobsFragment = document.createDocumentFragment();
              Array.from(jobListings.children)
                .map((listing) => {
                  const fields = [];
                  listing.querySelectorAll(".job-tags > li").forEach((tag) => {
                    fields.push(tag.textContent.trim());
                  });
                  const result = newFilters.every((filter) => {
                    return fields.includes(filter);
                  });
                  if (result) {
                    jobsFragment.appendChild(listing);
                  } else {
                    listings.appendChild(listing);
                  }
                })
                .filter((child) => child !== undefined);

              while (jobListings.firstChild) {
                jobListings.firstChild.remove();
              }
              jobListings.appendChild(jobsFragment);
            }

            const filterBtns = document.querySelectorAll(".filter-remove");
            filterBtns.forEach((filterBtn) => {
              filterBtn.addEventListener("click", () => {
                const filterBox = document.querySelector("#filters");
                const filterText = filterBox.querySelectorAll(".filter");
                let location = -1;
                filterText.forEach((entry, index) => {
                  if (
                    filterBtn.previousElementSibling.textContent.trim() ===
                    entry.textContent.trim()
                  ) {
                    location = index;
                  }
                });
                const newFiltersText = [];
                const newFilters = Array.from(filterBox.children)
                  .map((child, index) => {
                    if (location != index) {
                      newFiltersText.push(child.textContent.trim());
                      return child;
                    }
                  })
                  .filter((child) => child !== undefined);
                const fragment = document.createDocumentFragment();

                newFilters.forEach((child) => {
                  fragment.appendChild(child);
                });
                while (filterBox.firstChild) {
                  filterBox.firstChild.remove();
                }
                filterBox.appendChild(fragment);

                const prevListings = document.querySelector("#job-listings");
                Array.from(prevListings.children).forEach((listing) => {
                  listings.appendChild(listing);
                });
                const childNodesArray = Array.from(listings.childNodes);
                childNodesArray.sort((a, b) => {
                  const idA = a.getAttribute("data-id");
                  const idB = b.getAttribute("data-id");
                  return idA - idB;
                });
                const newListings = document.createDocumentFragment();

                childNodesArray
                  .map((listing) => {
                    const fields = [];
                    listing
                      .querySelectorAll(".job-tags > li")
                      .forEach((tag) => {
                        fields.push(tag.textContent.trim());
                      });
                    console.log(newFiltersText);
                    console.log(fields);
                    const result = newFiltersText.every((filter) => {
                      return fields.includes(filter);
                    });
                    if (result) {
                      newListings.appendChild(listing);
                    } else {
                      listings.appendChild(listing);
                    }
                  })
                  .filter((child) => child !== undefined);

                prevListings.appendChild(newListings);
              });
            });
          }
        });
      });
    });
  }
});

const clearAll = document.querySelector(".clear-btn");
clearAll.addEventListener("click", () => {
  document.querySelector("#filters").innerHTML = "";
  const filterBox = document.querySelector("#filters");
  const filterText = filterBox.querySelectorAll(".filter");
  let location = -1;
  filterText.forEach((entry, index) => {
    if (
      filterBtn.previousElementSibling.textContent.trim() ===
      entry.textContent.trim()
    ) {
      location = index;
    }
  });
  const newFiltersText = [];
  const newFilters = Array.from(filterBox.children)
    .map((child, index) => {
      if (location != index) {
        newFiltersText.push(child.textContent.trim());
        return child;
      }
    })
    .filter((child) => child !== undefined);
  const fragment = document.createDocumentFragment();

  newFilters.forEach((child) => {
    fragment.appendChild(child);
  });
  while (filterBox.firstChild) {
    filterBox.firstChild.remove();
  }
  filterBox.appendChild(fragment);

  const prevListings = document.querySelector("#job-listings");
  Array.from(prevListings.children).forEach((listing) => {
    listings.appendChild(listing);
  });
  const childNodesArray = Array.from(listings.childNodes);
  childNodesArray.sort((a, b) => {
    const idA = a.getAttribute("data-id");
    const idB = b.getAttribute("data-id");
    return idA - idB;
  });
  const newListings = document.createDocumentFragment();

  childNodesArray
    .map((listing) => {
      const fields = [];
      listing.querySelectorAll(".job-tags > li").forEach((tag) => {
        fields.push(tag.textContent.trim());
      });
      console.log(newFiltersText);
      console.log(fields);
      const result = newFiltersText.every((filter) => {
        return fields.includes(filter);
      });
      if (result) {
        newListings.appendChild(listing);
      } else {
        listings.appendChild(listing);
      }
    })
    .filter((child) => child !== undefined);

  prevListings.appendChild(newListings);
});
