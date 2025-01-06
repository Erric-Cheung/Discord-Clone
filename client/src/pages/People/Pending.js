import { useEffect, useState } from "react";
import ListItem from "../../components/People/ListItem";

const Pending = (props) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  console.log(pendingRequests);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/request/pending", {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });
        const resData = await res.json();

        setPendingRequests(resData.pendingRequests);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [props.token]);

  const acceptRequestHandler = async (requestId) => {
    const data = { requestId: requestId };

    const res = await fetch("/request/accept", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token,
      },
    });

    const resData = await res.json();
    console.log(resData);
  };

  return (
    <div>
      {pendingRequests.map((user) => {
        if (user.requestType === "outgoing") {
          return (
            <ListItem
              key={user.requestId}
              title={user.username}
              description="Outgoing Friend Request"
              type="outgoing"
            ></ListItem>
          );
        }
        return (
          <ListItem
            key={user.requestId}
            userId={user.userId}
            title={user.username}
            description="Incoming Friend Request"
            type="incoming"
            acceptRequest={acceptRequestHandler.bind(null, user.requestId)}
          ></ListItem>
        );
      })}
    </div>
  );
};

export default Pending;
