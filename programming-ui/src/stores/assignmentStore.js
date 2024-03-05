import { writable } from "svelte/store";

const assignment = writable(
  {
    id: 2,
    title: "Hello world",
    assignment_order: 2,
    handout: "Write a function 'hello' that returns the string 'Hello world!'",
    test_code: `import socket
  def guard(*args, **kwargs):
    raise Exception("Internet is bad for you :|")
  socket.socket = guard
  
  import unittest
  from code import *
  
  class TestHello(unittest.TestCase):
  
    def test_hello(self):
      self.assertEqual(hello(), "Hello world!", "Function should return 'Hello world!'")
  `
  }
);

export { assignment };
