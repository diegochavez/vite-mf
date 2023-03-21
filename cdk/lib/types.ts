import { Bucket } from "aws-cdk-lib/aws-s3";

export type WebAppBucket = {
    name: string;
    origin: string;
    bucket: Bucket | null;
    pathPattern?: string;
    isDefaultBehavior?: boolean;
}