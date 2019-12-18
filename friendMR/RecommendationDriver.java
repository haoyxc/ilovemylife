import java.io.BufferedReader;
import org.apache.hadoop.mapreduce.Job;
import java.io.InputStreamReader;
import java.net.URI;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class RecommendationDriver{
    public static void main(String[] args) throws Exception {
		if (args[0].equals("init")) {
		    init(args[1],args[2],Integer.parseInt(args[3]));
	    }
	    
	    else if (args[0].equals("iter")) {
		    iter(args[1],args[2],Integer.parseInt(args[3]));
	    }
	    
	    else if (args[0].equals("diff")) {
		    System.out.println(diff(args[1],args[2],args[3],args[4]));
	    }
	    
	    else if (args[0].equals("finish")) {
	    	finish(args[2],args[3],args[1],Integer.parseInt(args[3]));
	    }
	    else if (args[0].equals("composite")) {
	    	if (args.length>7) threshold = Double.parseDouble(args[7]);
	    	composite(args[1],args[2],args[3],args[4],args[5],Integer.parseInt(args[6]),threshold);
	    }

        
    }

    public static void init(String input, String output, String numReducers) throws Exception {
		
		//MapReduce Job configuration
		Job job = Job.getInstance();
		job.setJarByClass(RecommendationDriver.class);
		deleteDirectory(output);

		
		FileInputFormat.addInputPath(job, new Path(input));
		FileOutputFormat.setOutputPath(job, new Path(output));
		
		job.setMapperClass(InitMapper.class);
		job.setReducerClass(InitReducer.class);
		job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(Text.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);
		job.setNumReduceTasks(Integer.parseInt(numReducers));
		
		
		job.waitForCompletion(true);
	}

	public static void iter(String input, String output, int reducers) throws Exception {
		deleteDirectory(output);
		Job job = new Job();
		job.setNumReduceTasks(reducers);
		job.setJarByClass(RecommendationDriver.class);
	
		FileInputFormat.addInputPath(job, new Path(input));
		FileOutputFormat.setOutputPath(job, new Path(output));

		job.setMapperClass(IterMapper.class);
		job.setReducerClass(IterReducer.class);

		job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(Text.class);

		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);
	
		job.waitForCompletion(true);
	}
	public static double diff(String input1, String input2, String diffDir, String output) throws Exception{

	  	deleteDirectory(diffDir);//clear output dir. before proceeding
	  	Job job = new Job();
	  	job.setJarByClass(FriendRecommendationDriver.class);
	  
	  	FileInputFormat.addInputPath(job, new Path(input1));
	  	FileInputFormat.addInputPath(job, new Path(input2));
	  	FileOutputFormat.setOutputPath(job, new Path(diffDir));

	  	job.setMapperClass(DiffMapper.class);
	  	job.setReducerClass(DiffReducer.class);

	  	job.setMapOutputKeyClass(Text.class);
	  	job.setMapOutputValueClass(Text.class);

	  	job.setOutputKeyClass(IntWritable.class);
	  	job.setOutputValueClass(DoubleWritable.class);

	  	job.waitForCompletion(true);
	  
	  
	  return diffsort(diffDir,output); //Sort to get max difference 
  	}
  
  
    public static double diffsort(String input,String output) throws Exception{
	  	deleteDirectory(output);//Clear output dir.
	  	Job job = new Job();
	  	job.setJarByClass(FriendRecommendationDriver.class);
	  	job.setNumReduceTasks(1);
	  
	  	FileInputFormat.addInputPath(job, new Path(input));
	  	FileOutputFormat.setOutputPath(job, new Path(output));

	  	job.setMapperClass(DiffSortMapper.class);
	  	job.setReducerClass(DiffSortReducer.class);

	  	job.setMapOutputKeyClass(IntWritable.class);
	  	job.setMapOutputValueClass(DoubleWritable.class);

	  	job.setOutputKeyClass(Text.class);
	  	job.setOutputValueClass(DoubleWritable.class);

	  	job.waitForCompletion(true);
	  	return readDiffResult(output);
  	}
	  

	public static void composite(String input, String output, String interDir1, String interDir2, String diffDir, int reducers, double threshold) throws Exception 
  	{
	  int i = 0;
	  init(input, interDir1, reducers);
	  double diff = Double.MAX_VALUE;
	  while (diff>threshold) { //Run until convergence, meet threshold
		  iter(interDir1,interDir2,reducers);//run iter
		  if (i%4==0) //run diff only one in four iterations
			  diff = diff(interDir1,interDir2,diffDir,interDir1);//gets max diff 
		  //Swap intermediate dirs
		  String temp = interDir1;
		  interDir1 = interDir2;
		  interDir2 = temp;
		  
		  System.out.println("Iteration "+i+" diff:"+diff+","+System.currentTimeMillis());
		  i++;
	  }
	  finish(interDir1,output,input,reducers);
  }
  
  
  // Returns the first double from the first part-r-00000 file (output file)
  static double readDiffResult(String path) throws Exception 
  {
    double diffnum = 0.0;
    Path diffpath = new Path(path);
    Configuration conf = new Configuration();
    FileSystem fs = FileSystem.get(URI.create(path),conf);
    
    if (fs.exists(diffpath)) {
      FileStatus[] ls = fs.listStatus(diffpath);
    for (FileStatus file : ls) {
    	  System.out.println(file.getPath().getName()+" "+file.getLen());
	if (file.getPath().getName().startsWith("part-r-00000")) {
	  FSDataInputStream diffin = fs.open(file.getPath());
	  BufferedReader d = new BufferedReader(new InputStreamReader(diffin));
	  String diffcontent = d.readLine();
	  diffnum = Double.parseDouble(diffcontent);
	  d.close();
	}
      }
    }
    
    fs.close();
    return diffnum;
  }

  static void deleteDirectory(String path) throws Exception {
    Path todelete = new Path(path);
    Configuration conf = new Configuration();
    FileSystem fs = FileSystem.get(URI.create(path),conf);
    
    if (fs.exists(todelete)) 
      fs.delete(todelete, true);
      
    fs.close();
  }
  






}
