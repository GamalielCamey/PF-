import {ObjectId} from "bson";
import FlightsDAO from "./flightsDAO.js";

let tickets;
let packages;
let flights;
export default class TicketsDAO {
  static async injectDB(conn) {
    if (tickets && packages) {
      return;
    }
    try {
      tickets = await conn.db(process.env.FLYMATE_NS).collection("tickets");
      packages = await conn.db(process.env.FLYMATE_NS).collection("packages");
      flights = await conn.db(process.env.FLYMATE_NS).collection("flights");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addPackage(code, flight_id, amount, description, endDate) {
    try {
      const flight = await FlightsDAO.getFlightByID(flight_id);

      await packages.insertOne({
        ...flight,
        code: code,
        flight_id: flight_id,
        created: new Date(),
        fare: flight.defaultFare - flight.defaultFare * amount,
        amount: amount,
        description: description,
        endDate: endDate,
      });
      return {success: true};
    } catch (error) {
      console.error(
        `Error occurred while adding new flight's ticket, ${error}.`
      );
      return {error: error};
    }
  }

  static async addNewFlightTicket(flightId, totalTickets) {
    try {
      await tickets.insertOne({
        flight_id: flightId,
        totalTickets: totalTickets,
        availableTickets: totalTickets,
      });
      return {success: true};
    } catch (error) {
      console.error(
        `Error occurred while adding new flight's ticket, ${error}.`
      );
    }
  }

  static async addFlightTicket(
    {flight_id, email, type, fare, arrivalDate, departDate, passengers, purchased},
    availableTickets
  ) {
    try {
      await tickets.updateOne(
        {
          flight_id: flight_id,
        },
        {
          $set: {
            availableTickets: availableTickets - passengers,
          },
          $addToSet: {
            tickets: {
              _id: ObjectId(Math.random(1) * 1000000000)
                .toString()
                .replace(/[^0-9]/g, ""),
              email: email,
              departDate: departDate,
              arrivalDate: arrivalDate,
              purchased: purchased,
              type: type,
              passengers: passengers,
              fare: fare,
            },
          },
        },
        {
          upsert: true,
        }
      );
      return {success: true};
    } catch (error) {
      console.error(`Error occurred while adding new ticket, ${error}.`);
      return {error: error};
    }
  }

  static async getAvailableTicket(flightNum) {
    const flightTicket = await tickets.findOne({flight_id: flightNum});
    return flightTicket.availableTickets;
  }

  static async getAllPackages() {
    try {
      const allPackages = await packages.find().toArray();

      return allPackages;
    } catch (error) {
      console.error(`Error occurred while retrieving comments, ${error}`);
      return null;
    }
  }

  static async getPackageByCode(code) {
    try {
      const pipeline = [
        {
          $match: {
            code: code,
          },
        },
        {
          $project: {
            _id: 0,
            flight_id: 1,
            code: 1,
            created: 1,
            departure: 1,
            arrival: 1,
            duration: 1,
            fare: 1,
            amount: 1,
            description: 1,
            endDate: 1,
          },
        },
      ];
      return await packages.aggregate(pipeline).toArray();
    } catch (error) {
      console.error(`Error occurred while retrieving packages, ${error}`);
      return null;
    }
  }

  static async getFlightTicket(flightNum) {
    const flightTicket = await tickets.findOne({flight_id: flightNum});
    if (flightTicket == null) return true;
    return false;
  }

  static async compareTicket(ticket_id) {
    const pipeline = [
      {
        $match: {
          tickets: {
            $elemMatch: {
              _id: ticket_id,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          availableTickets: 1,
        },
      },
    ];
    if (!(await tickets.aggregate(pipeline).hasNext())) return false;
    return await tickets.aggregate(pipeline).next();
  }

  static async deleteTicket(ticket_id, availableTickets) {
    try {
      await tickets.updateOne(
        {
          tickets: {
            $elemMatch: {
              _id: ticket_id,
            },
          },
        },
        {
          $set: {
            availableTickets: availableTickets + 1,
          },
          $pull: {
            tickets: {
              _id: ticket_id,
            },
          },
        }
      );
      return {success: true};
    } catch (error) {
      console.error(`An error ocurred while deleting ticket ${error}`);
      return {error: error};
    }
  }

  static async getAllTickets() {
    try {
      const pipeline = [
        {
          $project: {
            _id: 0,
            "tickets.fare": 1,
            "tickets.purchased": 1,
          },
        },
      ];
      return tickets.aggregate(pipeline).toArray();
    } catch (error) {
      console.error(`Error occurred while retrieving tickets, ${error}`);
      return null;
    }
  }

  static async getTicket(email) {
    const pipeline = [
      {
        $match: {
          tickets: {
            $elemMatch: {
              email: email,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          flight_id: 1,
          "tickets._id": 1,
          "tickets.type": 1,
          "tickets.fare": 1,
          "tickets.departDate": 1,
          "tickets.arrivalDate": 1,
        },
      },
    ];
    return await tickets.aggregate(pipeline).toArray();
  }
}
