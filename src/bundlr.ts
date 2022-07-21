#!/usr/bin/env ts-node

import Bundlr from "@bundlr-network/client";
import bundlrConfig, { BundlrNetwork } from "../bundlr.config";
import * as fs from "fs";
import * as path from "path";
import * as fsp from "fs/promises";
import * as log from "./log";

const PROJECT_ROOT = path.resolve(__dirname, "../");
const ASSETS_PATH = path.resolve(PROJECT_ROOT, "assets");
const bundlrNetworks: { [K in BundlrNetwork]: string } = {
  node1: "https://node1.bundlr.network",
  node2: "https://node2.bundlr.network",
  devnet: "https://devnet.bundlr.network",
};

async function main() {
  const { network, currency, providerUrl, walletPath } = bundlrConfig;
  const jwk: number[] = JSON.parse(
    fs.readFileSync(path.resolve(PROJECT_ROOT, walletPath), {
      encoding: "utf8",
    })
  );
  const bundlr = new Bundlr(bundlrNetworks[network], currency, jwk, {
    providerUrl,
  });
  const balance = await bundlr.getLoadedBalance();
  log.info("Wallet Address:", bundlr.address);
  log.info("Balance: ", balance);
  const assetStats = await Promise.all(
    fs
      .readdirSync(ASSETS_PATH)
      .map((fileName) => fsp.stat(path.resolve(ASSETS_PATH, fileName)))
  ).catch((err) => {
    log.error(`Failed to read file stat: ${err.message}`);
    throw new Error(err);
  });
  const totalAssetsSize = assetStats.reduce(
    (total, stat) => total + stat.size,
    0
  );
  log.info("Total Assets Size: ", `${totalAssetsSize}bytes`);
  const price = await bundlr.getPrice(totalAssetsSize);
  if (balance.isGreaterThan(price)) {
    await bundlr.fund(balance.minus(price).multipliedBy(1.1));
  }
  const uploadResponse = await bundlr.uploader.uploadFolder(ASSETS_PATH);
  log.success("Successfully Uploaded: ", uploadResponse);
}

main();
