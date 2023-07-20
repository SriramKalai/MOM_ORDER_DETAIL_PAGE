async function updateCartLineItem(data, quantity, canRedirect, callback = null) {
    try{
      const response = await fetch('/cart/change.js', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }      
      }) 

      
      if ( response.status == 200 ){
        const res = await response.json();
        updateCartCount(quantity);
    
        if (canRedirect) {
          let newUrl = `${window.location.protocol}//${window.location.host}/cart`;
          window.location.href = newUrl;
        } 

        if (callback != null) {
          callback();
        }


      }
    }catch (error) {
      console.error(error);
    }

  
  }
  
  async function addTocart(id, properties, quantity, canRedirect, callback = null) {
    try {
      const response = await fetch('/cart.js');
      const data = await response.json();
      const items = data.items;
      const newItem = {
        variant_id: parseInt(id),
        properties: properties
      };
  
      delete newItem.properties['Virtual Consultation'];
  
      const newItemStringified = JSON.stringify(newItem);
      let index = 0;
      let itemFound = false;
  
      for (const item of items) {
        const testingItem = {
          variant_id: item.variant_id,
          properties: item.properties
        };
        delete testingItem.properties['Virtual consultation'];
        const testingItemStringified = JSON.stringify(testingItem);
  
        if (newItemStringified === testingItemStringified) {
          const newQty = item.quantity + parseInt(quantity);
          properties['Virtual consultation'] = false;
          // productAddToCartAnalytics(properties['Color']);
  
          await updateCartLineItem({
            'line': index + 1,
            'quantity': newQty,
            'properties': properties
          }, quantity, canRedirect, callback);
          itemFound = true;
          break;
        }
  
        index += 1;
      }
  
      if (!itemFound) {
        properties['Virtual consultation'] = false;
        // productAddToCartAnalytics(properties['Color']);
  
        await Shopify.addItem(quantity, id, properties, canRedirect, callback);
      }
    } catch (error) {
      console.error(error);
    }
  } 