import * as cdk from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { WebAppBucket } from './types';
import { WebApps } from './webapps';

import { config } from 'dotenv';
config();
export class CdkStack extends cdk.Stack {
  public readonly defaultIndexDocument: string;
  public readonly companyPrefix: string;
  public readonly stackEnvironment: string;
  public readonly region: string;
  public readonly domainName: string;
  public readonly frontendApps: WebAppBucket[];
  public readonly hostedZone: IHostedZone;
  cloudfrontDistribution: cdk.aws_cloudfront.Distribution;
  aRecord: cdk.aws_route53.ARecord;
  certificate: cdk.aws_certificatemanager.ICertificate;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // lets initialize project variables
    const env = process.env;
    this.defaultIndexDocument = 'index.html';
    this.companyPrefix = env.CDK_COMPANY_PREFIX as string;
    this.stackEnvironment = env.CDK_ENVIRONMENT as string;
    this.region = env.CDK_REGION as string;
    this.domainName = env.CDK_DOMAIN_NAME as string;
    // define the hosted zone
    this.hostedZone = cdk.aws_route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: this.domainName
    })
    // certificate from arn
    const certificateArn = env.CDK_CERTIFICATE_ARN as string;
    this.certificate = Certificate.fromCertificateArn(this, 'Certificate', certificateArn);
    // create the frontend apps based on the WebApps array
    this.frontendApps = WebApps.map((app) => this.createFrontendApp(app))
    this.cloudfrontDistribution = this.createCloudfrontDistribution(this.frontendApps);
    // get the alias record
    this.aRecord = new cdk.aws_route53.ARecord(this, 'AliasRecord', {
      zone: this.hostedZone,
      recordName: this.domainName,
      target: cdk.aws_route53.RecordTarget.fromAlias(new cdk.aws_route53_targets.CloudFrontTarget(this.cloudfrontDistribution)),
    })
    // wildcard record
    new cdk.aws_route53.ARecord(this, 'WildcardAliasRecord', {
      zone: this.hostedZone,
      recordName: `*.${this.domainName}`,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new cdk.aws_route53_targets.CloudFrontTarget(this.cloudfrontDistribution)
      ),
    })
  }
  // create the frontend apps method
  public createFrontendApp = (app: WebAppBucket) => {
    const bucketName = `${this.companyPrefix}-${this.stackEnvironment}-${app.name}`;
    return {
      // we need to keep previous values
      ...app,
      // we create a bucket for each app and add it to the app object
      bucket: new cdk.aws_s3.Bucket(this, `${app.name}-bucket`, {
        bucketName: bucketName,
        websiteIndexDocument: this.defaultIndexDocument,
        websiteErrorDocument: this.defaultIndexDocument,
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      })
    }
  }

  public createCloudfrontDistribution = (createdBuckets: WebAppBucket[]) => {
    if (createdBuckets.length == 0) throw new Error("No buckets created to create a distribution from.");
    const origin = new cdk.aws_cloudfront_origins.S3Origin(createdBuckets.find((app) => app.isDefaultBehavior)?.bucket as cdk.aws_s3.IBucket);
    const distribution = new cdk.aws_cloudfront.Distribution(this, 'CloudFrontDistribution', {
      priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origin,
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cdk.aws_cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      domainNames: [this.domainName, `*.${this.domainName}`],
      certificate: this.certificate,
      sslSupportMethod: cdk.aws_cloudfront.SSLMethod.SNI,
    })
    // add behaviors for each bucket

    createdBuckets.filter(x => !x.isDefaultBehavior).forEach((app) => {
      if (app.bucket == undefined) throw new Error("Bucket is undefined.");
      if (app.pathPattern == undefined) throw new Error("Path pattern is undefined.");
      const origin = new cdk.aws_cloudfront_origins.S3Origin(app.bucket);

      // caching static assets 
      // remove for demo purposes
      // distribution.addBehavior(`${app.origin}/assets/*`, origin, {
      //   cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
      //   viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      //   responseHeadersPolicy: cdk.aws_cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      // })

      // disabled caching for index.html
      distribution.addBehavior(app.pathPattern, origin, {
        cachePolicy: cdk.aws_cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cdk.aws_cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      })
    })

    return distribution;
  }
}
