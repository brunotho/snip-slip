import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";
import React from "react";
import { createRoot } from "react-dom/client";
import FriendshipManager from '../components/FriendshipManager';

Rails.start();
Turbolinks.start();

document.addEventListener('turbolinks:load', () => {
  const container = document.getElementById('friendship-manager');
  if (container) {
    console.log('Mounting FriendshipManager component');
    const root = createRoot(container);
    root.render(<FriendshipManager />);
  }
});
