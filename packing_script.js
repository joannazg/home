document.getElementById("destination_form").addEventListener("submit", function (packing_amount) {
    // Prevent the form from submitting normally
    packing_amount.preventDefault();

    var destination = document.querySelector(
      'input[name="destination"]:checked'
    ).value;
    var fancy = document.querySelector('input[name="fancy"]:checked').value;
    var trip_length = parseInt(
      document.getElementById("trip_length").value,
      10
    );

    let packing_list = [
      { item: "shorts", amount: 0.25 },
      { item: "pants", amount: 0.25 },
      { item: "t-shirts", amount: 1 },
      { item: "long sleeved shirts", amount: 0.5 },
      { item: "underwear", amount: 1 },
      { item: "socks", amount: 1 },
    ];

    packing_list = packing_list.map((item) => {
      return { item: item.item, amount: Math.ceil(item.amount * trip_length) };
    });

    if (fancy === "FANCY") {
      packing_list.push({ item: "fancy outfit", amount: 1 });
    }

    if (destination === "SNOWY" || destination === "COLD") {
      packing_list.push({ item: "jacket", amount: 1 });
      packing_list = packing_list.map((item) => {
        if (item.item === "shorts" || item.item === "t-shirts") {
          return { item: item.item, amount: 0 };
        } else if (item.item === "long sleeved shirts") {
          return { item: item.item, amount: Math.ceil(item.amount / 2) };
        }
        return item;
      });
    }

    if (destination === "HOT") {
      packing_list = packing_list.map((item) => {
        if (
          item.item === "pants" ||
          item.item === "long sleeved shirts" ||
          item.item === "socks"
        ) {
          return { item: item.item, amount: 0 };
        }
        return item;
      });
      packing_list.push({ item: "pair of sandals", amount: 1 });
    }

    if (destination === "RAINY") {
      packing_list.push({ item: "Raincoat", amount: 1 });
    }

    var final_list = document.getElementById("final_list");
    final_list.innerHTML = "";
    packing_list.forEach(function (item) {
        if (item.amount > 0) {
            final_list.innerHTML += '<li>' + item.amount + ' ' + item.item + '</li>';
        }
    });
  


  //document.getElementById("packing_questions").style.display = "none";
  document.getElementById("sample_list").style.display = "none";
  document.getElementById("list_result").style.display = "block";
});
