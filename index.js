class Order {
  constructor(id, date, total, customer) {
    this.id = id;
    this.date = date;
    this.total = parseFloat(total.replace("$", "").replace(",", ""));
    this.customer = customer;
  }
}

const calculateHighestSpender = (orders) => {
  let maxSpender = null;
  let maxAmount = 0;
  let customers = {};

  orders.forEach((order) => {
    const amount = order.total;
    const customerId = order.customer.mail;

    if (customers[customerId]) {
      customers[customerId] += amount;
    } else {
      customers[customerId] = amount;
    }

    for (const customerId in customers) {
      if (customers.hasOwnProperty(customerId)) {
        const amountSpent = customers[customerId];
        if (amountSpent > maxAmount) {
          maxAmount = amountSpent;
          maxSpender = orders.find(
            (order) => order.customer.mail === customerId
          ).customer;
        }
      }
    }
  });

  return {
    customer: maxSpender,
    total: maxAmount,
  };
};

const calculateHighestOrderCity = (orders) => {
  let cities = {};

  orders.forEach((order) => {
    if (cities.hasOwnProperty(order.customer.address.city)) {
      cities[order.customer.address.city]++;
    } else {
      cities[order.customer.address.city] = 1;
    }
  });

  let maxOrdersCity = Object.keys(cities).reduce((a, b) =>
    cities[a] > cities[b] ? a : b
  );

  return {
    city: maxOrdersCity,
    count: cities[maxOrdersCity],
  };
};

fetch("orders.json")
  .then((response) => response.json())
  .then((data) => {
    const orders = data.map((orderData) => {
      return new Order(
        orderData._id,
        orderData.date,
        orderData.total,
        orderData.customer
      );
    });

    const highestSpender = calculateHighestSpender(orders);
    const highestOrderCity = calculateHighestOrderCity(orders);

    console.log(`
    Highest spender person:

    Name: ${highestSpender.customer.name}
    Phone: ${highestSpender.customer.phone}
    Mail: ${highestSpender.customer.mail}
    Address: ${highestSpender.customer.address.zip} ${highestSpender.customer.address.city},${highestSpender.customer.address.street}
    
    with a total of $${highestSpender.total}.
    `);

    console.log(`
    Most orders were from: ${highestOrderCity.city}
    Orders count: ${highestOrderCity.count}
    `);
  })
  .catch((error) => {
    console.error(error);
  });
