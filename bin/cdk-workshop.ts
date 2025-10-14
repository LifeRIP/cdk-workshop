#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
//new CdkWorkshopStack(app, "CdkWorkshopStack");
new PipelineStack(app, "CdkWorkshopPipelineStack");
