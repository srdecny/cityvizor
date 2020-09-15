// load express app and export router
import express from 'express';

import { db, sort2order } from "../../db";
import { PaymentRecord } from '../../schema';

const router = express.Router();

export const CounterpartiesRouter = router;

// REQUEST: get event

router.get("/search", async (req, res, next) => {

  if (!req.query.query) return res.status(400).send("Missing parameter query");

  const counterparties = await db<PaymentRecord>("payments")
    .select("counterpartyId", "counterpartyName")
    .where("counterpartyName", "like", "%" + req.query.query + "%")
    .orWhere("counterpartyId", req.query.query);

  res.json(counterparties);

});

router.get("/top", async (req, res, next) => {

  const counterparties = await db<PaymentRecord>("payments")
    .select("counterpartyId")
    .where("profileId", req.query.profileId)
    .max("counterpartyName as counterpartyName")
    .sum("expenditureAmount as amount")
    .groupBy("counterpartyId")
    .orderBy("amount", "desc")
    .limit(req.query.limit ? Math.min(Number(req.query.limit), 10000) : 10000)
		.modify(function () {			
			if (req.query.dateFrom) this.where("date", ">=", req.query.dateFrom);
			if (req.query.dateTo) this.where("date", "<", req.query.dateTo);
		});

  res.json(counterparties);
});

router.get("/:id", async (req, res, next) => {

  const counterpartyNames = await db<PaymentRecord>("payments")
    .distinct("counterpartyName as name")
    .count("counterpartyName as c")
    .where("counterpartyId", req.params.id)
    .groupBy("counterpartyName")
    .orderBy("c", "desc")
  ;

  if (!counterpartyNames.length) return res.sendStatus(404);

  res.json(counterpartyNames);
});

router.get("/:id/accounting", async (req, res, next) => {

  const years = await db<PaymentRecord>("payments")
    .select("year", "type")
    .sum({ amount: "amount" })
    .where("counterpartyId", req.params.id)
    .groupBy("year", "type");

  if (years.length) res.json(years);
  else res.sendStatus(404);
});

router.get("/:id/accounting/:year", async (req, res, next) => {

  const accounting = await db<PaymentRecord>("payments")
    .select("type", "item", "paragraph", "unit")
    .sum({ amount: "amount" })
    .where({ "counterpartyId": req.params.id, "year": req.params.year })
    .groupBy("type", "item", "paragraph", "unit");

  if (accounting.length) res.json(accounting);
  else res.sendStatus(404);

});

router.get("/:id/payments", async (req, res, next) => {
  const payments = await db<PaymentRecord>("payments as p")
    .leftJoin("events as e", function () {
        this.on("p.event", "e.id")
        .andOn("p.profileId", "e.profileId")
        .andOn("p.year", "e.year")
    })
    .select("p.expenditureAmount as amount", "p.date", "p.description as description" )
    .where({ "p.counterpartyId": req.params.id, "p.profileId": req.query.profileId})
		.modify(function () {			
			if (req.query.dateFrom) this.where("p.date", ">=", req.query.dateFrom);
			if (req.query.dateTo) this.where("p.date", "<", req.query.dateTo);
		});

  if (payments.length) res.json(payments);
  else res.sendStatus(404);

});
