import { useState } from "react";
import { supabase } from "../lib/supabase";

function ConsumerRegister() {
  const [consumerName, setConsumerName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");

  async function createAccount(e) {
    e.preventDefault();

    const generatedConsumerNumber =
      "LPG" + Date.now().toString().slice(-6);

    const { error } = await supabase
      .from("consumers")
      .insert([
        {
          consumer_name: consumerName,
          consumer_number: generatedConsumerNumber,
          phone: phone,
          state: state,
          district: district,
          pincode: pincode,
          password: password,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Account Creation Failed");
    } else {
      alert(
        `Account Created Successfully!\n\nYour Consumer Number is:\n${generatedConsumerNumber}`
      );

      setConsumerName("");
      setPhone("");
      setState("");
      setDistrict("");
      setPincode("");
      setPassword("");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Consumer Registration</h1>

      <form onSubmit={createAccount}>
        <input
          type="text"
          placeholder="Consumer Name"
          value={consumerName}
          onChange={(e) =>
            setConsumerName(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) =>
            setState(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) =>
            setDistrict(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) =>
            setPincode(e.target.value)
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default ConsumerRegister;