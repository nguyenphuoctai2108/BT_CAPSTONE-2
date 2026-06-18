import { BASE_URL } from "../../../config.js";

// loadtable 
async function loadTable() {
    const res = await fetch(`${BASE_URL}/Products`);
    const rawData = await res.json();

    const table = document.getElementById("tableProducts")
    const tbody = document.getElementById("tbody")

    if (!table) return;

    tbody.innerHTML = '';

    rawData.forEach(element => {
        tbody.innerHTML += `
            <tr style="cursor: pointer;" class="itemProduct hover:bg-(--app-table-hover)" data-set="${element.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">${element.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <button type="button"  style="cursor: pointer;" data-set="${element.id}" class="btnDelete inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg text-blue-600 dark:text-blue-500 hover:text-red-700 dark:hover:text-red-600 focus:outline-hidden focus:text-blue-700 dark:focus:text-blue-600">Delete</button>
                </td>
            </tr>
        `
    });
}

loadTable();

// delete product
function deleteProducts() {
    const table = document.getElementById("tableProducts")

    if (!table) return;

    table.addEventListener("click", async (event) => {
        const btnDelete = event.target.classList.contains("btnDelete");

        if (!btnDelete) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        // console.log(result)

        if (result.isConfirmed) {
            const idProduct = Number(event.target.getAttribute("data-set"));

            try {
                const res = await fetch(`${BASE_URL}/Products/${idProduct}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Your product has been deleted.",
                        icon: "success"
                    });
                    loadTable();
                } else {
                    console.log("Error Delete");
                }


            } catch (error) {
                console.log("Error Connect", error);
            }

        } else {
            return console.log("cancel");
        }
    })
}

deleteProducts();

function loadProductIntoForm() {
    const table = document.getElementById("tableProducts");

    if (!table) return;

    table.addEventListener("click", async (e) => {
        const tr = e.target.closest(".itemProduct");

        if (!tr) return;

        const idPd = Number(tr.getAttribute("data-set"));

        if (!idPd) return;

        try {
            const res = await fetch(`${BASE_URL}/Products/${idPd}`, {
                method: 'GET'
            });

            const data = await res.json();

            document.getElementById('idP').value = data.id;
            document.getElementById('name').value = data.name;
            document.getElementById('type').value = data.type;
            document.getElementById('img').value = data.img;
            document.getElementById('price').value = data.price;
            document.getElementById('screen').value = data.screen;
            document.getElementById('backcamera').value = data.backCamera;
            document.getElementById('frontcamera').value = data.frontCamera;
            document.getElementById('description').value = data.desc;

        } catch (error) {
            console.log(error);
        }






    });
}

loadProductIntoForm();

function validateForm() {
    let isValid = true;

    const fields = ['name', 'img', 'type', 'price', 'screen', 'backcamera', 'frontcamera', 'description'];

    fields.forEach(id => {
        const input = document.getElementById(id);
        const errorMsg = document.getElementById(`error-${id}`);

        // Kiểm tra trống hoặc Price không phải là số
        const isInvalid = !input.value.trim() || (id === 'price' && isNaN(Number(input.value)));

        if (isInvalid) {
            input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            input.classList.remove('border-gray-200', 'focus:border-blue-700');
            if (errorMsg) errorMsg.classList.remove('hidden');
            isValid = false;
        } else {
            input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
            input.classList.add('border-gray-200', 'focus:border-blue-700');
            if (errorMsg) errorMsg.classList.add('hidden');
        }
    });

    return isValid;
}


function resetForm() {
    document.getElementById('idP').value = '';
    document.getElementById('name').value = '';
    document.getElementById('type').value = '';
    document.getElementById('img').value = '';
    document.getElementById('price').value = '';
    document.getElementById('screen').value = '';
    document.getElementById('backcamera').value = '';
    document.getElementById('frontcamera').value = '';
    document.getElementById('description').value = '';
}

document.getElementById('btnSubmit').addEventListener('click', async () => {
    if (!validateForm()) return;

    const idValue = document.getElementById('idP').value.trim();

    const Product = {
        name: document.getElementById('name').value,
        price: Number(document.getElementById('price').value),
        screen: document.getElementById('screen').value,
        backCamera: document.getElementById('backcamera').value,
        frontCamera: document.getElementById('frontcamera').value,
        img: document.getElementById('img').value,
        desc: document.getElementById('description').value,
        type: document.getElementById('type').value,
    };

    if (idValue) {
        Product.id = idValue;

        const res = await fetch(`${BASE_URL}/Products/${idValue}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Product)
        });

        loadTable();

    } else {
        const res = await fetch(`${BASE_URL}/Products`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Product)
        });

        loadTable();
    }
});

document.getElementById('btnReset').addEventListener('click', () => {
    resetForm()
});

document.getElementById('btnSearch').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput');
    try {
        const res = await fetch(`${BASE_URL}/Products/`);
        const allProducts = await res.json();

        const filter = allProducts.filter(item => {
            return item.name.toLowerCase().includes(searchInput.value.toLowerCase());
        });

        const tbody = document.getElementById("tbody")

        tbody.innerHTML = '';

        filter.forEach(element => {
            tbody.innerHTML += `
            <tr style="cursor: pointer;" class="itemProduct hover:bg-(--app-table-hover)" data-set="${element.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">${element.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <button type="button"  style="cursor: pointer;" data-set="${element.id}" class="btnDelete inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg text-blue-600 dark:text-blue-500 hover:text-red-700 dark:hover:text-red-600 focus:outline-hidden focus:text-blue-700 dark:focus:text-blue-600">Delete</button>
                </td>
            </tr>
        `
        });
    } catch (error) {
        console.log(error);
    }

})

document.getElementById("sortLowHigh").addEventListener('click', async () => {
    try {
        const res = await fetch(`${BASE_URL}/Products/`);
        const allProducts = await res.json();

        const afterSort = allProducts.toSorted((a, b) => Number(a.price) - Number(b.price));

        const tbody = document.getElementById("tbody")

        tbody.innerHTML = '';

        const htmlString = afterSort.map(element =>
            `
            <tr style="cursor: pointer;" class="itemProduct hover:bg-(--app-table-hover)" data-set="${element.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">${element.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <button type="button"  style="cursor: pointer;" data-set="${element.id}" class="btnDelete inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg text-blue-600 dark:text-blue-500 hover:text-red-700 dark:hover:text-red-600 focus:outline-hidden focus:text-blue-700 dark:focus:text-blue-600">Delete</button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = htmlString;

    } catch (error) {
        console.log(error);
    }

})

document.getElementById("sortHighLow").addEventListener('click', async () => {
    try {
        const res = await fetch(`${BASE_URL}/Products/`);
        const allProducts = await res.json();

        const sortedHighToLow = allProducts.toSorted((a, b) => Number(b.price) - Number(a.price));

        const tbody = document.getElementById("tbody");

        const htmlString = sortedHighToLow.map(element => `
            <tr style="cursor: pointer;" class="itemProduct hover:bg-(--app-table-hover)" data-set="${element.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">${element.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">${element.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <button type="button" style="cursor: pointer;" data-set="${element.id}" class="btnDelete inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg text-blue-600 dark:text-blue-500 hover:text-red-700 dark:hover:text-red-600 focus:outline-hidden focus:text-blue-700 dark:focus:text-blue-600">Delete</button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = htmlString;

    } catch (error) {
        console.log(error);
    }
});