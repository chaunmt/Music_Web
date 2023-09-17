const err = {
  BlockedTrack,
}

function BlockedTrack () {
  try {
    throw new Error()
  }
  catch (error) {
    console.error("Track is blocked");
    alert("Track is blocked");
  }
}

export default err;