// Importing necessary libraries and utilities
import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

// Function to retrieve contacts with optional query-based filtering
export async function getContacts(query) {
  // Simulating network delay with fakeNetwork function
  await fakeNetwork(`getContacts:${query}`);
  
  // Retrieving contacts from local storage
  let contacts = await localforage.getItem("contacts");
  
  // Initializing contacts to an empty array if not present
  if (!contacts) contacts = [];

  // Applying query-based filtering using matchSorter
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }

  // Sorting contacts by last name and creation date
  return contacts.sort(sortBy("last", "createdAt"));
}

// Function to create a new contact
export async function createContact() {
  // Simulating network delay with fakeNetwork function
  await fakeNetwork();

  // Generating a random id for the new contact
  let id = Math.random().toString(36).substring(2, 9);
  
  // Creating the contact object with id and creation date
  let contact = { id, createdAt: Date.now() };
  
  // Retrieving existing contacts
  let contacts = await getContacts();
  
  // Adding the new contact to the beginning of the contacts array
  contacts.unshift(contact);
  
  // Updating the contacts in local storage
  await set(contacts);

  // Returning the created contact
  return contact;
}

// Function to retrieve a specific contact by id
export async function getContact(id) {
  // Simulating network delay with fakeNetwork function
  await fakeNetwork(`contact:${id}`);
  
  // Retrieving contacts from local storage
  let contacts = await localforage.getItem("contacts");
  
  // Finding the contact with the specified id
  let contact = contacts.find((contact) => contact.id === id);
  
  // Returning the contact or null if not found
  return contact ?? null;
}

// Function to update a specific contact by id with provided updates
export async function updateContact(id, updates) {
  // Simulating network delay with fakeNetwork function
  await fakeNetwork();
  
  // Retrieving contacts from local storage
  let contacts = await localforage.getItem("contacts");
  
  // Finding the contact with the specified id
  let contact = contacts.find((contact) => contact.id === id);
  
  // Throwing an error if contact not found
  if (!contact) throw new Error("No contact found for", id);
  
  // Applying updates to the contact
  Object.assign(contact, updates);
  
  // Updating the contacts in local storage
  await set(contacts);

  // Returning the updated contact
  return contact;
}

// Function to delete a specific contact by id
export async function deleteContact(id) {
  // Retrieving contacts from local storage
  let contacts = await localforage.getItem("contacts");
  
  // Finding the index of the contact with the specified id
  let index = contacts.findIndex((contact) => contact.id === id);

  // Deleting the contact if found
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true; // Deletion successful
  }

  return false; // Contact not found
}

// Function to update contacts in local storage
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// Function to simulate network delay and cache responses
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;

  // Simulating network delay with setTimeout
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}