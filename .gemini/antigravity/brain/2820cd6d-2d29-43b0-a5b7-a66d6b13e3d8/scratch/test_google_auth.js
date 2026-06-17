async function test() {
  try {
    const res = await fetch('http://localhost:4000/api/catalog/bikes');
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Data length:', json.length || (json.bikes ? json.bikes.length : 'no length'));
    if (json.message) {
      console.log('Message:', json.message);
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

test();
